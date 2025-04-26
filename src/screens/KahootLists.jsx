import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./KahootLists.module.css";

function KahootLists() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Home");
      return;
    }

    fetch("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/user/whoami", {
      headers: { Authorization: `Bearer ${token}`, Accept: "*/*" }
    })
      .then((res) => res.json())
      .then((data) => setUserInfo(data));

    fetch("https://fptkahoot-eqebcwg8aya7aeea.southeastasia-01.azurewebsites.net/api/quiz/my-quiz", {
      headers: { Authorization: `Bearer ${token}`, Accept: "*/*" }
    })
      .then((res) => res.json())
      .then((data) => setQuizzes(data.data || []));
  }, [navigate]);

  const totalPages = Math.ceil(filteredQuizzes().length / quizzesPerPage);
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes().slice(indexOfFirstQuiz, indexOfLastQuiz);

  function filteredQuizzes() {
    return quizzes.filter((q) => q.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleEdit = (quiz) => {
    alert(`📝 Edit Quiz: ${quiz.title}`);
  };

  const handleDeleteClick = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete.id));
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>

        {userInfo && (
          <div className={styles.profile}>
            <img src={userInfo.avatar} alt="avatar" className={styles.avatar} />
            <h2 className={styles.name}>{userInfo.name}</h2>
            <p className={styles.email}>{userInfo.email}</p>
            <p className={styles.totalQuiz}>
              Total Quizzes: <strong>{quizzes.length}</strong>
            </p>
            <div className={styles.buttonGroup}>
    <button className={styles.importButton} onClick={() => alert("Import file feature coming soon!")}>
      📂 Import File
    </button>

    <button className={styles.createButton} onClick={() => navigate("/createK")}>
      + Create a Kahoot!
    </button>
  </div>
          </div>
        )}
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.title}>📚 Your Kahoot! Games</h1>

        {/* Search box */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Quiz List */}
        <div className={styles.quizList}>
          {currentQuizzes.map((quiz) => (
            <div key={quiz.id} className={styles.quizCard}>
              <div className={styles.cardContent}>
                <h3>{quiz.title}</h3>
                <p>Questions: {quiz.totalQuestion}</p>
                <p>Status: {quiz.isPublic ? "Public" : "Private"}</p>
              </div>

              <div className={styles.cardActions}>
                <button className={styles.editButton} onClick={() => handleEdit(quiz)}>
                  Edit
                </button>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(quiz)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {currentQuizzes.length === 0 && <p>No quizzes found!</p>}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>
            <span className={styles.pageNumber}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={styles.pageButton}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>❌ Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{quizToDelete?.title}</strong>?</p>
            <div className={styles.modalButtons}>
              <button onClick={() => setShowDeleteModal(false)} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={confirmDelete} className={styles.confirmDeleteButton}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KahootLists;
