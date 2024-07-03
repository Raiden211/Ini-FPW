import { useState, useEffect } from 'react';
import client from './connection';
import { object } from 'joi';
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";

const DetailData = (props) => {
    const [gamedata, setGamedata] = useState(null);
    const [editing, setEditing] = useState(false);

    const schema = Joi.object({
        title: Joi.string().required().messages({
            "string.empty": "Title gaboleh kosong"
        }),
        image: Joi.string().required().messages({
            "string.empty": "Url image gaboleh kosong"
        }),
        price: Joi.number().min(1000).required().messages({
            "number.empty": "Harga gaboleh kosong",
            "number.min": "Harga harus lebih dari 1000"
        }),
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
       resolver: joiResolver(schema)
    });

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

    const editData = async (data) => {
        try {
            const response = await client.put(`games/${props.index}`, data);
            alert("Game ini telah diedit");
            setEditing(false);
            getData();
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
        }
    }

    const onSubmit = (data) => {
        editData(data);
    };

    const deleteData = async (id) => {
        try {
            const response = await client.delete(`games/${id}`);
            alert("Game ini telah dihapus");
            props.setRoute("index");
        } catch (error) {
            console.error('Ada masalah:', error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
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
            {editing ? 
            <div key={gamedata.id} style={containerStyle}>
                    <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card shadow-2-strong" style={{borderRadius: "1rem"}}>
                        <div className="card-body p-5 text-center">
                            <h1>Edit games</h1>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <p>Title</p>
                                <input type="text" {...register("title")} defaultValue={gamedata.title} className="form-control" />
                                {errors.title && <span style={{ color: "red" }}>{errors.title.message} <br /></span>}
                                <p>Image url</p>
                                <input type="text" {...register("image")} defaultValue={gamedata.image} className="form-control" />
                                {errors.image && <span style={{ color: "red" }}>{errors.image.message} <br /></span>}
                                <p>Price</p>
                                <input type="number" {...register("price")} defaultValue={gamedata.price} className="form-control" />
                                {errors.price && <span style={{ color: "red" }}>{errors.price.message} <br /></span>}
                                <br />
                                <br />
                                <button type="submit" className="btn btn-success">Edit</button>
                                <button className='btn btn-warning' style={{marginLeft: '30px'}} onClick={() => setEditing(false)}>Back</button>
                            </form>
                        </div>
                        </div>
                    </div>
                    </div>    
                </div>
            </div>
            : 
            <div key={gamedata.id} style={containerStyle}>
                <img src={gamedata.image} alt={gamedata.title} style={imageStyle} />
                <p>Judul : {gamedata.title}</p>
                <p>Harga : {gamedata.price}</p>
                <div>
                    <button className='btn btn-warning' style={{marginRight: '30px'}} onClick={() => setEditing(true)}>Edit</button>
                    <button className='btn btn-danger' onClick={() => deleteData(gamedata.id)}>Delete</button>
                </div>
            </div>}
        </div>
    );
};

export default DetailData;
