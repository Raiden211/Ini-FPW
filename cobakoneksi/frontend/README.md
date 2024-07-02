# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

----------------------------

Oke, cut to the chase, jadi di src kalian bakal menemukan connection.jsx, itu menggunakan axios
Kemudian ada yg namanya useEffext, setauku untuk menyinkronkan dengan project backend
Nanti kalau sudah tinggal di put, post, delete, jangan lupa async = 
contoh
```
const datagame = async () => {
            try {
                const response = await client.get('games/get'); // di backend, route ini mengarah ke getAllGames
                console.log('API Response:', response.data); // response nya pasti data, ada juga response.data.data (mengambil data dari return res.send)
                
                if (response.data && Array.isArray(response.data.data)) {
                    props.setGames(response.data.data);
                } else {
                    console.error('Format error:', response.data);
                }
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };
```
