import { useEffect, useState } from "react";
import Header from "../../components/guest/Header";

function ProfilePage() {

  const [profiles, setProfiles] = useState(null);

  useEffect(() => {

    (async () => {
      const reponse = await fetch(`http://localhost:3001/api/profils/`)
      const data = await reponse.json();
      setProfiles(data)
      console.log(data);
    })()

  }, [])

 
  return (
    <>
    <Header />
      <main>
        {/* Est-ce que profile contient quelque chose ? */}
        {profiles ? (
          <>
            {/* Je fais un array map pour récupérer les profils grâce à la variable profiles de useState */}
            {profiles.map((profile) => {
              return (
                <article>
                  <h2> Pseudo : {profile.inGameName} </h2>
                  <p> Bio : {profile.profilBio} </p>
                  {/* Ternaire pour que REACT me retourne mon composant même si leur valeur sont null */}
                </article>
              )

            })}
          </>

        ) : (

          <p>Profils en cours de chargement</p>

        )}
      </main>
    </>
  );
}

export default ProfilePage;
