import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import client from "./connection";

const AddData = (props) => {

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

    const addData = async (data) => {
        try {
            const response = await client.post(`games/post?title=${data.title}&image=${data.image}&price=${data.price}`);
            if (response.status === 201) {
                alert("Data berhasil ditambah");
                props.setRoute("index");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert("Nama sudah ada");
                reset();
            } else {
                console.error('Error adding data :', error);
                alert("Terjadi kesalahan. Silakan coba lagi.");
                reset();
            }
        }
    };    

    return (
        <>
            <div>
                <h3>Tambah data</h3>
                <button className='btn btn-primary' onClick={() => props.setRoute("index")}>Back</button>
            </div>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow-2-strong" style={{borderRadius: "1rem"}}>
                    <div className="card-body p-5 text-center">
                        <h1>Add new Games</h1>
                        <form onSubmit={handleSubmit(addData)}>
                            <p>Title</p>
                            <input type="text" {...register("title")} className="form-control" />
                            {errors.title && <span style={{ color: "red" }}>{errors.title.message} <br /></span>}
                            <p>Image url</p>
                            <input type="text" {...register("image")} className="form-control" />
                            {errors.image && <span style={{ color: "red" }}>{errors.image.message} <br /></span>}
                            <p>Price</p>
                            <input type="text" {...register("price")} className="form-control" />
                            {errors.price && <span style={{ color: "red" }}>{errors.price.message} <br /></span>}
                            <br />
                            <br />
                            <button type="submit" className="btn btn-success">Add</button>
                        </form>
                    </div>
                    </div>
                </div>
                </div>    
            </div>
        </>
    )
}
export default AddData;