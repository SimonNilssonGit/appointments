import React, {useState, useEffect } from 'react'
import {db} from '../firebase'
import { collection, getDocs } from "firebase/firestore"; 

// Ska visas på egen admin sida
// ex. vanliga sidan www.massage.com
// denna: www.massage.com/admin

const GetAppointments = () => {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);


    const getAppointments = async () => {
        // Reset appointments
        setAppointments([]);
        
        const querySnapshot = await getDocs(collection(db, "appointments"));
        querySnapshot.forEach((doc) => {
            var result = doc.data();
            console.log(result.name + ", " + result.email + ", " + result.date + ", " + result.time)
            
            setAppointments(appointments => [...appointments, {
                id: appointments.length,
                name: result.name,
                email: result.email,
                date: result.date,
                time: result.time
            }]);
        });
    }

    const test = () => {
        console.log(appointments);
    }
    useEffect(() => {
        getAppointments();
        
    }, [])

    if(loading){
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <button onClick={getAppointments}>get</button>
            <button onClick={test}>console log</button>
            
            <ul>
                {appointments.map((a) => {
                return(<li key={a.id}>
                    {a.name}
                    {a.email}
                    {a.date}
                    {a.time}</li>)
                })}
            </ul>
        </div>
    )
}

export default GetAppointments
