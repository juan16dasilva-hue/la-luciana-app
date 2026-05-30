import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./Admin.css";

function Admin() {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
const [busqueda, setBusqueda] = useState("");
const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
const [categoriaAumento, setCategoriaAumento] = useState("");
const [porcentajeAumento, setPorcentajeAumento] = useState("");
const [tipoRedondeo, setTipoRedondeo] = useState("ninguno");
const [redondearArriba, setRedondearArriba] = useState(true);
const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
  cargarProductos();
}, []);

async function guardarProducto() {
  console.log("EDITANDO:", productoEditando);

  const { data, error } = await supabase
    .from("productos")
    .update({
      nombre: productoEditando.nombre,
      categoria: productoEditando.categoria,
      precio: Number(productoEditando.precio),
      descripcion:
        productoEditando.descripcion,
    })
    .eq("id", productoEditando.id)
    .select();

  console.log("RESULTADO:", data);
  console.log("ERROR:", error);

  if (!error) {
    await cargarProductos();
    setProductoEditando(null);

    alert("✅ Producto actualizado");
  } else {
    alert("❌ Error al guardar");
  }
}

async function cargarProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  console.log("ADMIN DATA:", data);

  if (!error) {
    setProductos(data);
  }
}

const categorias = [
  "Todas",
  ...new Set(
    productos.map((p) => p.categoria)
  ),
];

const productosFiltrados = productos.filter(
  (producto) => {
    const coincideBusqueda =
      producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaFiltro === "Todas" ||
      producto.categoria === categoriaFiltro;

    return (
      coincideBusqueda &&
      coincideCategoria
    );
  }
);

   return (
    <div className="admin">
      <h1>Panel Administrador</h1>
<div className="filtros-admin">
  <input
    type="text"
    placeholder="🔍 Buscar producto..."
    value={busqueda}
    onChange={(e) =>
      setBusqueda(e.target.value)
    }
  />


<div className="aumento-masivo">
  <h3>📈 Actualización masiva</h3>

  <select
    value={categoriaAumento}
    onChange={(e) =>
      setCategoriaAumento(e.target.value)
    }
  >
    <option value="">
      Seleccionar categoría
    </option>

    {categorias
      .filter((c) => c !== "Todas")
      .map((categoria) => (
        <option
          key={categoria}
          value={categoria}
        >
          {categoria}
        </option>
      ))}
  </select>

  <input
    type="number"
    placeholder="% de aumento"
    value={porcentajeAumento}
    onChange={(e) =>
      setPorcentajeAumento(
        e.target.value
      )
    }
  />

  <select
    value={tipoRedondeo}
    onChange={(e) =>
      setTipoRedondeo(e.target.value)
    }
  >
    <option value="ninguno">
      Sin redondeo
    </option>

    <option value="50">
      A 50 más cercano
    </option>

    <option value="100">
      A 100 más cercano
    </option>

    <option value="500">
      A 500 más cercano
    </option>

    <option value="1000">
      A 1000 más cercano
    </option>
  </select>

  <label>
    <input
      type="checkbox"
      checked={redondearArriba}
      onChange={() =>
        setRedondearArriba(
          !redondearArriba
        )
      }
    />

    Redondear siempre hacia arriba
  </label>

  <button>
    Aplicar aumento
  </button>
</div>
  <select
    value={categoriaFiltro}
    onChange={(e) =>
      setCategoriaFiltro(
        e.target.value
      )
    }
  >
    {categorias.map((categoria) => (
      <option
        key={categoria}
        value={categoria}
      >
        {categoria}
      </option>
    ))}
  </select>
</div>

      <div className="productos-admin">
       {productosFiltrados.map((producto) => (
          <div
            key={producto.identificador || producto.id}
            className="producto-admin"
          >
            <div className="producto-header">
              <div>
                <h3>{producto.nombre}</h3>

                <p>
                  {producto.categoria ||
                    producto.categorías}
                </p>

                <p>
                  <strong>
                    ${producto.precio}
                  </strong>
                </p>
              </div>

              <button
               onClick={() =>
  setProductoEditando(
    productoEditando?.id === producto.id
      ? null
      : producto
  )
}              
>
                ✏️ Editar
              </button>
            </div>

            {productoEditando &&
              (productoEditando.identificador ||
                productoEditando.id) ===
                (producto.identificador ||
                  producto.id) && (
                <div className="editor">
                  <input
                    type="text"
                    value={
                      productoEditando?.nombre || ""
                    }
                    onChange={(e) =>
                      setProductoEditando({
                        ...productoEditando,
                        nombre: e.target.value,
                      })
                    }
                    placeholder="Nombre"
                  />

                  <input
                    type="text"
                    value={
                      productoEditando?.categoria ||
                      productoEditando?.categorías ||
                      ""
                    }
                    onChange={(e) =>
                      setProductoEditando({
                        ...productoEditando,
                        categoria: e.target.value,
                      })
                    }
                    placeholder="Categoría"
                  />

                  <input
                    type="number"
                    value={
                      productoEditando?.precio || ""
                    }
                    onChange={(e) =>
                      setProductoEditando({
                        ...productoEditando,
                        precio: e.target.value,
                      })
                    }
                    placeholder="Precio"
                  />

                  <textarea
                    value={
                      productoEditando?.descripcion ||
                      productoEditando?.descripción ||
                      ""
                    }
                    onChange={(e) =>
                      setProductoEditando({
                        ...productoEditando,
                        descripcion:
                          e.target.value,
                      })
                    }
                    placeholder="Descripción"
                  />

                  <div className="acciones-editor">
                    <button onClick={guardarProducto}>
  💾 Guardar
</button>

                    <button
                      onClick={() =>
                        setProductoEditando(null)
                      }
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;