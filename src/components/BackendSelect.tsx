import { useGlobalContext } from "../context/Global";
import { useCreateContext } from "../context/Create";
import { IoClose } from "solid-icons/io";
import { config } from "../config";

const BackendSelect = () => {
    const { backend, setBackend, fetchPairs, t } = useGlobalContext();
    const { backendSelect, setBackendSelect } = useCreateContext();

    // Handle backend change
    const changeBackend = (index: number) => {
        setBackend(index);
        fetchPairs();
        // setBackendSelect(false); // Close the backend selection frame after selection
    };

    return (
        <div
            class="frame assets-select"
            onClick={() => setBackendSelect(false)}
            style={backendSelect() ? "display: block;" : "display: none;"}
        >
            <span class="close" onClick={() => setBackendSelect(false)}>
                <IoClose />
            </span>
            <h2>{t("select_backend")}</h2>
            <table class="backend-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Alias</th>
                        <th>URL</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {config.backends.map((b, index) => (
                        <tr
                            onClick={() => changeBackend(index)}
                            class={backend() === index ? "selected" : ""}
                        >
                            <td>{index + 1}</td>
                            <td>{b.alias}</td>
                            <td>fh</td>
                            <td>ghj</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BackendSelect;