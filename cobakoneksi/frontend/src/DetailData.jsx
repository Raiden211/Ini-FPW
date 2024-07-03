import { useState, useEffect } from 'react';
import client from './connection';
import { object } from 'joi';

const DetailData = (props) => {
    const [gamedata, setGamedata] = useState(null);
    const [editing, setEditing] = useState(false);

    const getData = async () => {
        try {
            const response = await client.get(`games/get1/${props.index}`);
            setGamedata(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
        }
    };

    const editData = async () => {
        try {

        } catch (error) {

        }
    }

    const deleteData = async () => {
        try {

        } catch (error) {
            
        }
    }

    useEffect(() => {
        getData();
    }, [props.index]);

    if (!gamedata) {
        return <div>Loading...</div>;
    }

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100vh',
    };

    const imageStyle = {
        height: '300px',
        width: '250px',
    };

    const buttonStyle = {
        marginBottom: '20px',
    };

    return (
        <div >
            <div style={buttonStyle}>
                <h3>Liat data</h3>
                <button className='btn btn-primary' onClick={() => props.setRoute("index")}>Back</button>
            </div>
            <div key={gamedata.id} style={containerStyle}>
                <img src={gamedata.image} alt={gamedata.title} style={imageStyle} />
                <p>{gamedata.title}</p>
                <p>{gamedata.price}</p>
            </div>
        </div>
    );
};

export default DetailData;
