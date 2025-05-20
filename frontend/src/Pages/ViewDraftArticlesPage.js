import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkUserAuthentication } from "../util/authUtil";
import "./ViewDraftArticlesPageStyle.css";
import NavBar from "./NavBar";
function ViewDraftArticlesPage() {
  const [draftArticles, setDraftArticles] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const isAuthenticated = await checkUserAuthentication();
      if (isAuthenticated === -1) {
        window.location.href = "/";
        return;
      }
    }

    async function fetchDraftArticles() {
      try {
        const response = await fetch(
          "http://localhost:3001/Routes/GetDraftArticles"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch draft articles");
        }
        const data = await response.json();
        setDraftArticles(data);
      } catch (error) {
        console.error("Error fetching draft articles:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    fetchDraftArticles();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="draft-articles-container">
        <h1
          style={{
            textAlign: "center",
          }}
          className="draft-articles-heading"
        >
          Draft Articles
        </h1>
        {isLoading ? (
          <p>Loading draft articles...</p>
        ) : error ? (
          <p className="error-message">
            Error fetching draft articles: {error.message}
          </p>
        ) : draftArticles === null || draftArticles.length === 0 ? (
          <p>No draft articles exist for the user.</p>
        ) : (
          <div
            className="draft-articles-list"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {draftArticles.map((article) => (
              <div
                key={article.article_id}
                className="draft-article-item"
                style={{
                  backgroundColor: "rgb(255, 228, 196)",
                  borderRadius: "10px",
                  padding: "2rem",
                }}
              >
                <Link
                  to={`/DraftArticlePage/${article.article_id}/${article.user_id}`}
                  className="article-link"
                >
                  <h2
                    style={{
                      color: "black",
                      fontSize: "1.75rem",
                      paddingLeft: "0.5rem",
                    }}
                    className="article-title"
                  >
                    {article.title}
                  </h2>
                </Link>
                {article.article_picture && (
                  <div
                    className="image-container"
                    style={{
                      paddingLeft: "0",
                    }}
                  >
                    <img
                      src={`http://localhost:3001/Images/${article.article_picture}`}
                      alt={article.title}
                      className="article-image"
                      style={{
                        width: "80%",
                        height: "auto",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}
                <p
                  style={{
                    color: "black",
                    paddingLeft: "0.5rem",
                    fontWeight: " 100 ",
                  }}
                  className="article-category"
                >
                  Category: {article.category_name}
                </p>
                <p
                  style={{
                    color: "black",
                    paddingLeft: "0.5rem",
                    fontWeight: " 100 ",
                  }}
                  className="article-status"
                >
                  Status: {article.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewDraftArticlesPage;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { checkUserAuthentication } from "../util/authUtil";
// import "./ViewUploadedArticlesPageStyles.css";
// import NavBar from "./NavBar";
// function ViewDraftArticlesPage() {
//   const [draftArticles, setDraftArticles] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       const isAuthenticated = await checkUserAuthentication();
//       if (isAuthenticated === -1) {
//         window.location.href = "/";
//         return;
//       }
//     }

//     async function fetchDraftArticles() {
//       try {
//         const response = await fetch(
//           "http://localhost:3001/Routes/GetDraftArticles"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch draft articles");
//         }
//         const data = await response.json();
//         setDraftArticles(data);
//       } catch (error) {
//         console.error("Error fetching draft articles:", error);
//         setError(error);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchData();
//     fetchDraftArticles();
//   }, []);

//   return (
//     <div class="article-list">
//       <NavBar />
//       <h1 class="page-title">Draft Articles</h1>
//       {isLoading ? (
//         <p class="loading-message">Loading draft articles...</p>
//       ) : error ? (
//         <p class="error-message">
//           Error fetching draft articles: {error.message}
//         </p>
//       ) : draftArticles === null || draftArticles.length === 0 ? (
//         <p class="no-articles-message">No draft articles exist for the user.</p>
//       ) : (
//         <ul class="article-items">
//           {draftArticles.map((article) => (
//             <li key={article.article_id} class="draft-article-item">
//               <Link
//                 to={`/DraftArticlePage/${article.article_id}/${article.user_id}`}
//                 class="article-link"
//               >
//                 <h2 class="article-title">{article.title}</h2>
//               </Link>
//               <br></br>
//               {article.article_picture && (
//                 <div class="image-container">
//                 <img
//                   src={`http://localhost:3001/Images/${article.article_picture}`}
//                   alt={article.title}
//                   class="article-image"
//                 />
//                 </div>
//               )}

//               <p className="article-info"> Category: {article.category_name}</p>
//               <p className="article-info">Status: {article.status}</p>
//           </li>
//           ))}
//         </ul>
//       )}
//     </div>

//   );
// }

// export default ViewDraftArticlesPage;
