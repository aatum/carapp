import React from 'react';
import { useState, useEffect } from 'react';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from '@mui/material/Button';
import AddCar from './AddCar';
import { API_URL } from '../constants';
import EditCar from './EditCar';

export default function Carlist(){
    const [cars, setCars] = useState([]);

    const [columnDefs] = useState([
        {field: 'brand', sortable: true, filter: true},
        {field: 'model', sortable: true, filter: true},
        {field: 'color', sortable: true, filter: true},
        {field: 'fuel', sortable: true, filter: true},
        {field: 'year', sortable: true, filter: true, width: 120},
        {field: 'price', sortable: true, filter: true, width: 150},
        {
            width: 120,
            cellRenderer: params => <EditCar data={params.data} editCar={updateCar}/>
        },
        {
            width: 120,
            cellRenderer: params => <Button color = 'error' onClick={() => deleteCar(params.data)}>Delete</Button>
        }
    ])

    useEffect(() => {
        getCars();
    }, []);

    const getCars = () => {
        fetch(API_URL)
        .then(response => {
        if (response.ok)
            return response.json();
        else
            alert('Something went wrong');
        })
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error)
}


    const deleteCar = (data) => {
        window.confirm('Are you sure?')
        fetch(data._links.car.href, {method: 'DELETE'})
        .then(response => {
            if (response.ok)
                getCars();
            else
                alert('Something went wrong in deletion');
        })
        .catch(err => console.error(err))
    }

    const addCar = (car) => {
        fetch(API_URL, {
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(car)
        })
        .then(response => {
            if (response.ok)
                getCars();
            else
                alert('Something went wrong in the addition!')
        })
        .catch(err => console.error(err))
    }

    const updateCar = (car, url) => {
        fetch(url, {
            method: 'PUT',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(car)
        })
        .then(response => {
            if (response.ok)
                getCars();
            else
                alert('Something went wrong in the addition!')
        })
        .catch(err => console.error(err))
    }

    return(
        <>
        <AddCar addCar={addCar}/>
        <div className='ag-theme-material' style={{height: 650, width: '90%', margin:'auto'}}>
            <AgGridReact 
                rowData={cars}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}   
                suppressCellFocus={true}
        />
        </div>
        </>
    );
    }

