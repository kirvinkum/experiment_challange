import React, {useEffect, useRef, useState} from 'react';
import axios from "../api/Axios";
import {Link, useNavigate} from "react-router-dom";

const UPLOAD_URL = '/api/upload';

const Upload = () => {

    const navigate = useNavigate();
    const userRef = useRef();
    const errRef = useRef();
    const [name, setName] = useState('');
    const [assayResultfile, setAssayResultfile] = useState('');
    const [compoundIc50file, setCompoundIc50file] = useState('');
    const [labelsFile, setLabelsFile] = useState('');


    const [progressState, setProgressState] = useState('Create');
    const [nameErr, setNameErr] = useState('');
    const [assayResultfileErr, setAssayResultfileErr] = useState('');
    const [compoundIc50fileErr, setCompoundIc50fileErr] = useState('');
    const [labelsFileErr, setLabelsFileErr] = useState('');

    useEffect(() => {
        setNameErr('')
        setAssayResultfileErr('')
        setCompoundIc50fileErr('')
        setLabelsFileErr('')
    }, [name, assayResultfile,compoundIc50file,labelsFile])

    const handleSubmit = async (e) => {
        e.preventDefault();

        setProgressState("Processing...")

        let formData = new FormData();
        formData.append('name', name);
        formData.append('assay_result_file', assayResultfile);
        formData.append('compound_ic50_file', compoundIc50file);
        formData.append('compound_labels', labelsFile);

        try {
            await axios.post(UPLOAD_URL, formData);
            navigate("/dashboard", { replace: true });
        } catch (err){
            let data = err.response?.data
            if(data?.name){
                setNameErr(data.name[0])
            }
            if(data?.assay_result_file){
                setAssayResultfileErr(data.assay_result_file[0])
            }
            if(data?.compound_ic50_file){
                setCompoundIc50fileErr(data.compound_ic50_file[0])
            }
            if(data?.compound_labels){
                setLabelsFileErr(data.compound_labels[0])
            }
            setProgressState("Create");
        }
    }

    return (
        <div className="center-col">
                <Link to='/dashboard'>Back to dashboard</Link>
                <h2>Create New Experiment</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Experiment Name</label>
                    <input
                        type="text"
                        id="name"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <span ref={errRef} className="error" aria-live="assertive">{nameErr}</span>

                    <input type="file"
                           id="assay_result_file"
                           onChange={(e) => setAssayResultfile(e.target.files[0])}
                           className="file-selector"
                    />
                    <label htmlFor="assay_result_file">Select Assay Result file</label>
                    <span>{assayResultfile['name']}</span>
                    <span className="error">{assayResultfileErr}</span>


                    <input type="file"
                           id="compound_ic50_file"
                           onChange={(e) => setCompoundIc50file(e.target.files[0])}
                           className="file-selector"
                    />
                    <label htmlFor="compound_ic50_file">Select Compound IC50 file</label>
                    <span>{compoundIc50file['name']}</span>
                    <span className="error">{compoundIc50fileErr}</span>


                    <input type="file"
                           id="compound_labels"
                           onChange={(e) => setLabelsFile(e.target.files[0])}
                           className="file-selector"
                    />
                    <label htmlFor="compound_labels">Select Compounds Labels file</label>
                    <span>{labelsFile['name']}</span>
                    <span className="error">{labelsFileErr}</span>
                    <button className="button">{progressState}</button>
                </form>
        </div>
    );
};

export default Upload;