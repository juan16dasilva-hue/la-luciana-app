import logo from "./logo.png";
import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaAbierta, setCategoriaAbierta] = useState(null);
const [nombre, setNombre] = useState("");
const [telefono, setTelefono] = useState("");
const [direccion, setDireccion] = useState("");
const [pago, setPago] = useState("");
const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    console.log("ESTADO PRODUCTOS:", productos);
  }, [productos]);

  async function cargarProductos() {
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("categoria");

    console.log("DATOS:", data);
    console.log("ERROR:", error);

    if (!error) {
      setProductos(data);
    }
  }

  function agregarAlCarrito(producto) {
    setCarrito([...carrito, producto]);
  }

  function quitarDelCarrito(index) {
    setCarrito(carrito.filter((_, i) => i !== index));
  }

  const carritoAgrupado = carrito.reduce((acc, item) => {
    const existente = acc.find((p) => p.id === item.id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      acc.push({
        ...item,
        cantidad: 1,
      });
    }

    return acc;
  }, []);

  const total = carrito.reduce(
    (suma, item) => suma + Number(item.precio),
    0
  );

  const mensajeWhatsApp =
   `PEDIDO:%0A` +
  carrito
    .map((item) => `• ${item.nombre} - $${item.precio}`)
    .join("%0A") +
  `%0A%0A TOTAL: $${total}%0A`+
`Nombre: ${nombre}%0A` +
  `Teléfono: ${telefono}%0A` +
  `Dirección: ${direccion}%0A` +
  `Forma de pago: ${pago}%0A%0A` ;


  const productosFiltrados = productos.filter((producto) =>
    producto.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const productosPorCategoria = productosFiltrados.reduce(
  (acc, producto) => {
    const categoria = String(
      producto.categoria || "Sin categoría"
    )
      .trim()
      .replace(/\s+/g, " ");

    if (!acc[categoria]) {
      acc[categoria] = [];
    }

    acc[categoria].push(producto);

    return acc;
  },
  {}
);
console.log(
  "CATEGORIAS:",
  Object.keys(productosPorCategoria)
);
return (
    <div className="app">
      <div className="header">
  <img
    src={logo}
    alt="La Luciana"
    className="logo"
  />

  <p>Parrilla • Restaurante</p>
</div>
<div className="banner">
  <div className="banner-overlay">
    <h2> La Luciana • Cocina de excelencia</h2>
<p>Parrilla • Pastas • Mariscos</p>
    <div className="banner-info">
      <span>🚚 Envíos</span>
      <span>🥩 Parrilla</span>
      <span>🍝 Pastas</span>
      <span>🍰 Postres</span>
    </div>
  </div>
</div>
      <input
className="buscador"
        type="text"
        placeholder="🔍 Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      

      <div className="resumen">
  <h2>🛒 Carrito: {carrito.length} productos</h2>
  <h3>💰 Total: ${total}</h3>
</div>

      <h3>🛒 Mi pedido</h3>

      {carritoAgrupado.map((item, index) => (
        <div key={index}>
          <p>
            {item.nombre} x{item.cantidad} - $
            {item.precio * item.cantidad}
          </p>

          <button onClick={() => quitarDelCarrito(index)}>
            ❌ Quitar
          </button>
        </div>
      ))}

      <hr />

      {Object.entries(productosPorCategoria).map(
        ([categoria, items]) => (
          <div key={`cat-${categoria}`}>
          <h2
  className="categoria"
  onClick={() =>
    setCategoriaAbierta(
      categoriaAbierta === categoria
        ? null
        : categoria
    )
  }
>
  {categoriaAbierta === categoria ? "🔽" : "▶️"} "{categoria}"
</h2> 

            {categoriaAbierta === categoria &&
              items.map((producto) => (
                <div
  key={producto.id}
  className="producto"
>
                  <h3>{producto.nombre}</h3>

                  <p>{producto.descripcion}</p>

                  <p className="precio">
  ${producto.precio}
</p>
                  <button
  className="boton-agregar"
  onClick={() =>
    agregarAlCarrito(producto)
  }
>
                    ➕ Agregar al pedido
                  </button>

                  <hr />
                </div>
              ))}
          </div>
        )
      )}

<h2>👤 Datos del cliente</h2>

<input
  className="buscador"
  type="text"
  placeholder="Nombre"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
/>

<input
  className="buscador"
  type="text"
  placeholder="Teléfono"
  value={telefono}
  onChange={(e) => setTelefono(e.target.value)}
/>

<input
  className="buscador"
  type="text"
  placeholder="Dirección"
  value={direccion}
  onChange={(e) => setDireccion(e.target.value)}
/>
<input
  className="buscador"
  type="text"
  placeholder="📝 Observaciones (sin cebolla, bien cocido, sin sal, etc.)"
  value={observaciones}
  onChange={(e) => setObservaciones(e.target.value)}
/>


<select
  className="buscador"
  value={pago}
  onChange={(e) => setPago(e.target.value)}
>
  <option value="">Forma de pago</option>
  <option value="Efectivo">Efectivo</option>
  <option value="Transferencia">Transferencia</option>
  <option value="Tarjeta">Tarjeta</option>
</select>      
<h2>📞 Pedidos</h2>

      <div className="whatsapp">
  <a
    href={`https://wa.me/541130077426?text=Hola%20La%20Luciana,%20quiero%20pedir:%0A%0A${mensajeWhatsApp}`}
    target="_blank"
    rel="noreferrer"
  >
    <button>
      📱 Enviar pedido por WhatsApp
    </button>
  </a>
</div>
</div>
  );
}

export default App;