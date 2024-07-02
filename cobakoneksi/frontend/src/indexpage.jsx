import React, { useEffect } from 'react';
import client from './connection';
import './App.css';

const Index = (props) => {

    useEffect(() => {
        const datagame = async () => {
            try {
                const response = await client.get('games/get');
                console.log('API Response:', response.data);
                
                if (response.data && Array.isArray(response.data.data)) {
                    props.setGames(response.data.data);
                } else {
                    console.error('Format error:', response.data);
                }
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        datagame();
    }, []);

    const getDetails = (id) => {
        props.setIndex(id);
        console.log(id);
        props.setRoute("details");
    }

    return (
        <>
            <div>
                <h3>Halo ges</h3>
                <button className='btn btn-primary' onClick={() => props.setRoute('add')}>Tambah Data</button>
            </div>
            <div className="container2">
                <h2>All games</h2>
                <div className="row row-cols-1 row-cols-md-4 g-4 justify-content-between">
                    {props.games.map(game => (
                        <div className="col card-container" key={game.id}>
                            <div className="card" style={{ width: '18rem' }}>
                                <img src={game.image} className="card-img-top" alt={game.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{game.title}</h5>
                                    <p className="card-text">{game.description}</p>
                                    <button className="btn btn-primary" onClick={() => getDetails(game.id)}>Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Index;