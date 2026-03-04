import { useId} from "react";
import {useState} from "react"

const useSerchForm = ({idTechnology, idText, idLocation, idExperienceLevel, onSearch, ontextFilter}) => {
  const [searchText, setSearchText] = useState("");
  
  const handleSubmit = (event) => {
      event.preventDefault()
      const formData = new FormData(event.target);
      const newFilters = {
        textBuscador: formData.get(idText),
        technology: formData.get(idTechnology),
        location: formData.get(idLocation),
        experienceLevel: formData.get(idExperienceLevel)
      }
      setSearchText(newFilters.textBuscador);
      onSearch(newFilters);
    }

    return {handleSubmit, searchText, setSearchText}
}





export function SearchFormSection({onSearch}) {
  const idText = useId();
  const idTechnology = useId();
  const idLocation = useId();
  const idExperienceLevel = useId();

  const [focusField, setFocusField] = useState(null);


  const {handleSubmit, searchText, setSearchText} = useSerchForm({idTechnology, idText, idLocation, idExperienceLevel, onSearch})
  return (
    <>
    <form onSubmit = {handleSubmit} id='empleos-search-form'  role="search">
      <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#a09fdf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-search">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>
          <input onFocus={() => setFocusField("search")} onBlur = {() => setFocusField(null)}
          name={idText} id="empleos-search-input" type="text" 
          placeholder="Buscar trabajos, empresas o habilidades"
          style = {{BorderColor: focusField ==="search" ? '#4f46e5' : '#d1d5db',
          outline: focusField === "search" ? "2px solid #4f46e5": "none" 
          }} />
          <button hidden id="" type="submit">Buscar</button>
      </div>
      {focusField === "search" ? 
        <small>Busca por título...</small> 
        : null}
    
      <div className="aling-left" role="filter">
        <select name= {idTechnology} id="search-tecnology">
          <option value="">Todas las tecnologías</option>
          <option value="react">React</option>
          <option value="node">Node.js</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="mobile">Mobile</option>
        </select>
        <select name={idLocation} id="search-ubi">
          <option value="">Todas las ubicaciones</option>
          <option value="remoto">Remoto</option>
          <option value="cdmx">Ciudad de México</option>
          <option value="guadalajara">Guadalajara</option>
          <option value="barcelona">Barcelona</option>
          <option value="bsas">Buenos Aires</option>
          <option value="madrid">Madrid</option>
          <option value="valencia">Valencia</option>
          <option value="bogota">Bogotá</option>
          <option value="lima">Lima</option>
          <option value="santiago">Santiago de Chile</option>
          <option value="monterrey">Monterrey</option>
        </select>
        <select name={idExperienceLevel} id="search-nivel">
          <option value="">Nivel de experiencia</option>
          <option value="junior">Junior</option>
          <option value="mid-level">Mid-Level</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
      </div>
    </form>
  </>
  )
}

