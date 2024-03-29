import { jwtDecode } from "jwt-decode";
import HeaderAdmin from "../../components/admin/HeaderAdmin";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/guest/Footer";

function AdminProfilesPage() {

  const [profiles, setProfiles] = useState(null);
  // Hook useState pour stocker le message d'erreur pour chaque profil
  const [errorMessages, setErrorMessages] = useState({});

  const token = localStorage.getItem("jwt");

  const decodedToken = jwtDecode(token)

  // Fetch pour get tout les profils
  useEffect(() => {
    (async () => {
      const profilesResponse = await fetch("http://localhost:3001/api/profils")
      const profilesResponseData = await profilesResponse.json();
      setProfiles(profilesResponseData)
      console.log(profilesResponseData);
    })();
  }, [])

  // Fetch pour supprimer un profil
  const handleDeleteProfiles = async (event, profilesId) => {
    // Déclaration d'une variable avec un fetch de l'api pour récupérer le delete + l'id du profil
    const deleteProfileResponse = await fetch("http://localhost:3001/api/profils/" + profilesId, {
      // La méthode "DELETE" est un delete
      method: "DELETE",
      // Seulement quelqu'un qui a un token peut supprimer les profils 
      headers: { Authorization: "Bearer " + token }
    });

    // Boolean pour gérer les messages de status
    if (deleteProfileResponse.status === 403) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [profilesId]: `Droits insuffisants`
      }));
    } else {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [profilesId]: `Erreur ! `
      }));
    }

    // Second fetch d'api pour mettre a jour suite à une supression d'un profil
    const profilesResponse = await fetch('http://localhost:3001/api/profils');
    const profilesResponseData = await profilesResponse.json();
    setProfiles(profilesResponseData);

  }



  return (
    <>
      <HeaderAdmin />
      <div className="backgroundImg">
        <h1>Liste des profils : </h1>
        {profiles ? (
          <>
            {profiles.map((profile) => {
              return (
                <article>
                  <h2>{profile.inGameName}</h2>
                  {/* Affiche le message d'erreur correspondant au profil cliqué */}
                  {errorMessages[profile.id] && <p>{errorMessages[profile.id]}</p>}
                  {/* récupération du token.data, si le role de l'utilisateur n'est pas 3 alors il ne peut pas supprimer un profil */}
                  {decodedToken.data.role !== 3 && (
                    <button className="button1" onClick={(event) => handleDeleteProfiles(event, profile.id)}>Supprimer le profil</button>
                  )}
                  <Link to={`/admin/profils/update/${profile.id}`}>
                    <button className="button1">Mettre à jour le profil</button>
                  </Link>
                </article>
              );
            })}
          </>
        ) : (
          <p>En cours de chargement</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AdminProfilesPage;
