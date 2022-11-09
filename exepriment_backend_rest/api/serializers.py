import io
from django.db import transaction
from rest_framework import serializers
from .models import Label, Experiment, Data, Compound
import csv
from django.core.validators import FileExtensionValidator

class UploadSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=3, max_length=20)
    assay_result_file = serializers.FileField(validators=[FileExtensionValidator(allowed_extensions=['csv'])])
    compound_ic50_file = serializers.FileField(validators=[FileExtensionValidator(allowed_extensions=['csv'])])
    compound_labels = serializers.FileField(validators=[FileExtensionValidator(allowed_extensions=['csv'])])

    '''
    Create 2 dicts (compoundData,labelData) to save:
    1.So that only 1 cycle of for loop csv parse happens during validation and preparing data
    2.So that search/lookup will be with constant time when building data for models
    '''
    experimentData =[]
    compoundData ={}
    labelData ={}
    uniqueLabels = set();

    def validate_assay_result_file(self, file):
        decoded_file = file.read().decode()
        io_string = io.StringIO(decoded_file)
        reader = csv.reader(io_string)
        # validate cols
        header = next(reader)
        #clear extra space from header
        header = list(filter(str.strip, header))
        total_cols = len(header)
        if "Compound ID" not in header:
            raise serializers.ValidationError(['Must contains header "Compound ID". Make sure not special character of space present.'])
        if "Concentration (M)" not in header:
            raise serializers.ValidationError(['Must contains header "Concentration (M)". Make sure not special character of space present.'])
        if "% Inhibition" not in header:
            raise serializers.ValidationError(['Must contains header "% Inhibition"'])
        if total_cols != 3:
            raise serializers.ValidationError(['File assay_result_file must contains 2 columns but %s found.' % total_cols])
        # validate data
        rowIndex = 1
        for row in reader:
            cid = row[0].strip()
            conc = row[1].strip()
            inh = row[2].strip()
            if not cid.isnumeric():
                raise serializers.ValidationError('File assay_result_file contains invalid compound id in row %s' % rowIndex)
            if not self.is_float(conc):
                raise serializers.ValidationError('File assay_result_file contains invalid  Concentration (M) in row %s' % rowIndex)
            if not self.is_float(inh):
                raise serializers.ValidationError('File assay_result_file contains invalid Inhibition in row %s' % rowIndex)
            rowIndex += 1
            self.experimentData.append({"cid":cid, "conc": float(conc) ,"inh": float(inh)})
        return file

    def validate_compound_ic50_file(self, file):
        decoded_file = file.read().decode()
        io_string = io.StringIO(decoded_file)
        reader = csv.reader(io_string)
        # validate cols
        header = next(reader)
        # clear extra space from header
        header = list(filter(str.strip, header))
        total_cols = len(header)
        if "Compound ID" not in header:
            raise serializers.ValidationError(['Must contains header "Compound ID". Make sure not special character of space present.'])
        if " IC50 (M)" not in header:
            raise serializers.ValidationError(['Must contains header "IC50 (M)". Make sure not special character of space present.'])
        if total_cols != 2:
            raise serializers.ValidationError('File compound_ic50_file must contains 2 columns but %s found.' % total_cols)
        # validate data
        rowIndex = 1
        for row in reader:
            cid = row[0].strip()
            ic50 = row[1].strip()
            if not cid.isnumeric():
                raise serializers.ValidationError(
                    'File compound_ic50_file contains invalid compound id in row %s' % rowIndex)
            if not self.is_float(ic50):
                raise serializers.ValidationError('File compound_ic50_file contains invalid  IC50 (M) in row %s' % rowIndex)
            rowIndex += 1
            self.compoundData[cid] = {"ic50": float(ic50)}
        return file

    def validate_compound_labels(self, file):
        decoded_file = file.read().decode()
        io_string = io.StringIO(decoded_file)
        reader = csv.reader(io_string)
        # validate cols
        header = next(reader)
        total_cols = len(header)
        if "Compound ID" not in header:
            raise serializers.ValidationError(['Must contains header "Compound ID". Make sure not special character of space present.'])
        if "Assay Result Label" not in header:
            raise serializers.ValidationError(['Must contains header "Assay Result Label". Make sure not special character of space present.'])
        if total_cols != 2:
            raise serializers.ValidationError('File compound_labels must contains 2 columns but %s found.' % total_cols)
        # validate data
        rowIndex = 1
        for row in reader:
            cid = row[0].strip()
            label = row[1].strip()
            if not cid.isnumeric():
                raise serializers.ValidationError('File compound_labels contains invalid compound id in row %s' % rowIndex)
            if len(label) == 0:
                raise serializers.ValidationError('File compound_labels contains invalid label in row %s' % rowIndex)
            rowIndex += 1
            self.uniqueLabels.add(label)
            self.labelData[cid] = {"label": label}
        return file

    def is_float(self, value):
        try:
            float(value)
            return True
        except ValueError:
            return False

    def create(self, validated_data):

        with transaction.atomic():

            experiment = self.create_experiment(validated_data.get('name'))
            self.create_compounds()

            dataBatch = list()
            for expData in self.experimentData:
                compound_id = expData['cid']
                compound_raw = self.compoundData[compound_id]
                compound = Compound(id=compound_id, ic50=compound_raw['ic50'], label=compound_raw['label'])
                dataBatch.append(Data(
                    concentration=expData['conc'],
                    inhibition=expData['inh'],
                    compound=compound,
                    experiment=experiment
                ))

            Data.objects.bulk_create(dataBatch, ignore_conflicts=True)

    def create_experiment(self,name):
        # Save experiment
        if Experiment.objects.filter(name=name).exists():
            raise serializers.ValidationError({"name": ["Experiment with this name already exists."]})
        experiment = Experiment(name=name)
        experiment.save()
        return experiment

    def create_labels(self):
        '''
        This function will setup labels
        Labels are first inserted using  bulk_create and dic used to pre store label data for fast search when creating compounds,
        Data is pre-stored in dict as we know we have only few limited(repeatable) labels and this will increase look up in constant time
        '''
        Label.objects.bulk_create(
            [Label(label=label) for label in self.uniqueLabels],
            ignore_conflicts=True,
        )
        labels = {}
        queries = Label.objects.all()
        for x in queries:
            labels[x.label] = x.id
        return labels

    def create_compounds(self):
        '''
        This function is responsible to preparing compound data for the experiment
        Data structure(dicts) and bulk_create is used to improve speed 10X times compared to nested create or get_or_create
        '''
        labels = self.create_labels()
        compoundBatch = list()
        for compound in self.compoundData:
            compound_id = compound
            ic50 = self.compoundData[compound_id]['ic50']
            #get label data from prepared labels
            label_str = self.labelData[compound_id]['label']
            label_id = labels[label_str];
            label = Label(id=label_id, label=label_str)
            compoundBatch.append(Compound(id=compound_id, ic50=ic50, label=label))
            #update label in compound
            self.compoundData[compound_id]['label'] = label


        Compound.objects.bulk_create(compoundBatch, ignore_conflicts=True)


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ["label", "id"]


class ExperimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experiment
        fields = ["name"]

    def create(self, validated_data):
        # experiment
        if Experiment.objects.filter(name=validated_data['name']).exists():
            raise serializers.ValidationError("Experiment with this name already exists.")
        experiment = Experiment(name=validated_data['name'])
        experiment.save()


class ExperimentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(allow_blank=False, min_length=3, max_length=50, required=True)

    class Meta:
        model = Experiment
        fields = ['id','name', 'created_at']

class CompoundSerializer(serializers.ModelSerializer):
    label = serializers.CharField(allow_blank=False, min_length=3, max_length=50, required=True)

    class Meta:
        model = Compound
        fields = ['id','label', 'ic50']

class ExperimentDataSerializer(serializers.ModelSerializer):
    experiment = ExperimentSerializer(read_only=True)
    compound = CompoundSerializer(read_only=True)

    class Meta:
        model = Data
        fields = ['concentration', 'inhibition', 'experiment', 'compound']


class ExperimentCompoundSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    class Meta:
        model = Data
        fields = '__all__'


class DeleteExperimentSerializer(serializers.Serializer):
    experiment_id = serializers.IntegerField()
    def delete(self, validated_data):
        exp_id = validated_data['experiment_id']
        Experiment.objects.filter(id=exp_id).delete()


class IDSerializer(serializers.Serializer):
    id = serializers.IntegerField()

class ScatterDataSerializer(serializers.Serializer):
    experiment_id = serializers.IntegerField()
    label_id = serializers.IntegerField()
    compound_start_id = serializers.IntegerField()
    compound_end_id = serializers.IntegerField()
