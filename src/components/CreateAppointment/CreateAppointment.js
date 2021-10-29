import React, {useState, useEffect } from 'react'
import {db} from '../../firebase'
import { collection, addDoc, doc, getDocs } from "firebase/firestore";

import TextField from '@material-ui/core/TextField';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import svLocale from 'date-fns/locale/sv'
import { Button } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import './CreateAppointmentStyles.css'

const useStyles = makeStyles((theme) => ({
  timeButton: {
    background: "rgba(6, 177, 28, 0.3)",
    "&:hover": {
      background: 'rgba(6, 177, 28, 0.5)',
      boxShadow: '0 3px 5px 2px rgba(6, 177, 28, 0.3)',
    },
  },
  timeButtonSelected: {
    background: "rgba(6, 177, 28, 0.9)",
    color: 'white',
    "&:hover": {
      background: 'rgba(6, 177, 28, 0.8)',
      boxShadow: '0 3px 5px 2px rgba(6, 177, 28, 0.3)',
    }
  },
}));

const CreateAppointment = () => {

  const classes = useStyles();


  const initialAvailableTimes = [
    {
      id: 0,
      time: '09:00-09:30',
      open: true,
    },
    {
      id: 1,
      time: '09:30-10:00',
      open: true,
    },
    {
      id: 2,
      time: '10:00-10:30',
      open: true,
    },
    {
      id: 3,
      time: '10:30-11:00',
      open: true,
    },
    {
      id: 4,
      time: '11:30-12:00',
      open: true,
    },
    {
      id: 5,
      time: '13:00-13:30',
      open: true,
    },
    {
      id: 6,
      time: '14:00-14:30',
      open: true,
    },
    {
      id: 7,
      time: '15:00-15:30',
      open: true,
    },
    {
      id: 8,
      time: '15:30-16:00',
      open: true,
    },
  ];
    
    const todaysDate = new Date();
    // Holds date in datepicker for visuals
    const [datePickerDate, setDatePickerDate] = useState(todaysDate);
    
    const [timeId, setTimeId] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState(); 
    const [date, setDate] = useState(`${todaysDate.getFullYear()}-${todaysDate.getMonth() + 1}-${todaysDate.getDate()}`); 
    const [time, setTime] = useState();
    
    const [availableTimes, setAvailableTimes] = useState(() => initialAvailableTimes);
    const [appointments, setAppointments] = useState([]);
    // Used to call re-renders
    const [loadedAppointments, setLoadedAppointments] = useState(false);
    const [changedDate, setChangedDate] = useState(false);
    
    const [selectedTime, setSelectedTime] = useState('');
    
    const [booked, setBooked] = useState(false);

    const createAppointment = async () => {
        console.log('Bokar tid...');

        try {
            const docRef = await addDoc(collection(db, "appointments"), {
              id: timeId,
              name: name,
              email: email,
              date: date,
              time: time,
            });
            console.log("Document written with ID: ", docRef.id);
            setBooked(true);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }


    const getName = (val) => {
        setName(val.target.value);
    }
    const getEmail = (val) => {
        setEmail(val.target.value);
    }
    const handleDateChange = (newDate) => {
      const formattedDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
      // Store the formatted date
      setDate(formattedDate);

      // Just for holding the data on the date picker (visual)
      setDatePickerDate(newDate);
  
      setChangedDate(true);

      console.log('new date picked');
    };
    const getTime = (val, id) => {
      setTime(val);
      setTimeId(id);
      setSelectedTime(val);
    }

    const checkAvailability = async () => {
      // Om de ska gå boka 1 timme
      // Ny array med 1h tider
      // Bool som kollar om man ska boka 30 eller 60min
      // Visar array med 1timme tider (bara visual, ändrar inte open bool här)
      // Då måste check availability kolla så att 2 30min tider är lediga bredvid varandra med hjälp av id
      // När man bokar 1h tid, så sätts de två 30min tiderna till open = false
      
      
      // Set all times to open
      resetAvailableTimes();

      console.log('Kollar lediga tider...');

      appointments.map((item) => {
        // Compare dates from database
        if(item.date == date){
          availableTimes.map((t) => {
            // Compare times from database
            if(item.id == t.id){
              // Set time as booked 
              t.open = false;
              
              // For hour appointments
              //if(availableTimes[t.id + 1] == true)
            }
          })
        }
      })
    }
    const getAppointments = async () => {
      // Reset appointments
      setAppointments([]);

      setLoadedAppointments(false);
      
      const querySnapshot = await getDocs(collection(db, "appointments"));
      querySnapshot.forEach((doc) => {
          var result = doc.data();
          setAppointments(appointments => [...appointments, {
              id: result.id,
              name: result.name,
              email: result.email,
              date: result.date,
              time: result.time
          }]);
      });
      setLoadedAppointments(true);
  }
  // Load appointments
    useEffect(() => {
      getAppointments();
    }, [])
    // Check if available on first load
    useEffect(() => {
      if(loadedAppointments){
        checkAvailability();
        // Used to force a re-render so times shows as booked
        setLoadedAppointments(false);
      }
    }, [loadedAppointments])
    // Check if avialable when changing dates
    useEffect(() => {
      if(changedDate){
        checkAvailability();
        // Used to force a re-render so times shows as booked

        setChangedDate(false);
      }
    }, [date])


const resetAvailableTimes = () => {
  // Reset times for a new date
  availableTimes.map((t) => {
    // Set time as open
    t.open = true;
  });
}


    return (
      
    <section className="section" id="appointment">
      <div className="section-divider" />
            <br />
            <br />
      <div className="container">
        <h1>Boka tid</h1>
          <div className="input-container">
          <TextField id="standard-basic" label="Namn" onChange={getName} />
          <TextField id="standard-basic" label="E-post" onChange={getEmail} />

            <MuiPickersUtilsProvider locale={svLocale} utils={DateFnsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          //disableToolbar
          variant="inline"
          //format="yyyy-mm-dd"
          margin="normal"
          id="date-picker-inline"
          label="Välj datum"
          value={datePickerDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
   
    {!booked ? <h3>Boka tid: {selectedTime}</h3>
    : <h3>Bokning genomförd! <br/>
       Datum: {date} <br/>
       Tid: {selectedTime} </h3>
    }
    <div className="times-div">
    

    <Grid container className="available-times" spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={1}>
          {availableTimes.map((available) => (
            <Grid key={available.id} item>
              { available.open ? <Button className={classes.timeButton} onClick={() => getTime(available.time, available.id)} variant="contained" size="small" /*color="primary"*/ >{available.time}</Button>
              : <Button variant="contained" size="small" disabled >{available.time}</Button>  }
            </Grid>
          ))}
        </Grid>
      </Grid>
      </Grid>
      </div>
      <div>  
      <Button className="submit-btn" onClick={createAppointment} variant="contained" size="large" color="primary" >Boka tid</Button>
      </div>   
    </div>  
  </div>
</section>
    )
}

export default CreateAppointment


/*
try {
            const docRef = await addDoc(collection(db, "users"), {
              first: "Ada",
              last: "Lovelace",
              born: 1815
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
*/