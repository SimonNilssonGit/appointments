import { useState, useEffect } from "react";
import  { projectFirestore } from '../firebase/config';

import React from 'react'

const useFirestore = (collection) => {

    const [docs, setDocs] = useState([]);

    useEffect(() => {
        const unsub = projectFirestore.collection(collection)
        // Sort by date created in descending order
        .orderBy('createdAt', 'desc') 
        // Gets called when there is a change
        .onSnapshot((snap) => {
            let documents = [];
            snap.forEach(doc => {
                documents.push({...doc.data(), id: doc.id})
            });
            setDocs(documents);
        })
    return () => unsub();

    }, [collection])

    return { docs };

}

export default useFirestore
