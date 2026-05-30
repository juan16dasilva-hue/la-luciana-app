import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./Admin.css";

function Admin() {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    const { data, error } = await supabase
      .from("productos")
      .select("*");

    console.log("ADMIN DATA:", data);

    if (!error) {
      setProductos(data);
    }
  }

  return (
    <div className="admin">
      <h1>Panel Administrador</h1>

      <div className="productos-admin">
        {productos.map((producto) => (
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
                    productoEditando?.identificador ===
                      producto.identificador
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
                    <button>
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