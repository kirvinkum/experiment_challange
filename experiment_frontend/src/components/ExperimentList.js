import React, {useState, useEffect} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate, useLocation, Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDna, faTrash, faSpinner} from '@fortawesome/free-solid-svg-icons'
import Moment from 'react-moment';
import useDashboardFilter from "../hooks/DashboardFilter";

const DELETE_URL = '/api/experiment/delete';


const ExperimentList = () => {

    const {dashboardFilter, setDashboardFilter} = useDashboardFilter();

    const [experiments, setExperiments] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const handleDelete = async (id) => {
        setExperiments(prevState => {
            return prevState.map((experiment) => {
                return experiment.id === id ? {...experiment, isDeleting: true} : experiment
            })
        })
        try {
            await axiosPrivate.post(DELETE_URL, {'experiment_id': id});
            setExperiments(experiments.filter((experiment) => experiment.id !== id))
        } catch (err) {
            //console.log(err.response.data)
            navigate('/login', {state: {from: location}, replace: true});
        }
    }

    const handleSelect = (_experiment) => {
        setDashboardFilter(prev => {
            return {...prev, experiment: _experiment}
        });

    }


    useEffect(() => {

        const getExperiments = async () => {
            try {
                const response = await axiosPrivate.get('/api/experiment/list');
                if (response.data.length > 0) {
                    setDashboardFilter(prev => {
                        return {...prev, experiment: response.data[0]}
                    });
                }
                setExperiments(response.data);
            } catch (err) {
                navigate('/login', {state: {from: location}, replace: true});
            }
        }

        getExperiments();
        // eslint-disable-next-line
    }, [])

    return (
        <div className="experiment-list-box">

            <Link to="/upload" className="right link-button">
                Add new experiment
            </Link>
            <h4>Experiments</h4>
            {experiments?.length
                ? (

                    <ul className="experiment-list">
                        {experiments.map((experiment, i) => <li
                            key={experiment.id}
                            className={dashboardFilter.experiment?.id === experiment.id ? "select" : ""}
                            onClick={() => handleSelect(experiment)}>
                            <FontAwesomeIcon icon={faDna}/>
                            <p>

                                {experiment.name} {experiment?.isDeleting}

                                <span className="time">
                                    <Moment format="MMM Do YYYY">
                                        {experiment.created_at}
                                    </Moment>

                                </span>

                            </p>

                            {experiment.isDeleting && <FontAwesomeIcon icon={faSpinner} className="fa-spin"/>}
                            {!experiment.isDeleting &&
                                <FontAwesomeIcon icon={faTrash}
                                                 onClick={() => handleDelete(experiment.id)}/>
                            }
                        </li>)}
                    </ul>
                ) : ''
            }
        </div>
    );
};

export default ExperimentList;