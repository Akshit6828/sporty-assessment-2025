import Modal from "../../../components/global/modal/modal";
import "./view-season-modal.scss";
import Loader from "../../../components/global/loader/loader";
interface seasonModalData {
  seasonImg: string;
  seasonName: string;
  showModal: boolean;
  leagueName?: String;
  leagueAlternateName?: String;
  sportName?: String;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

export default function ViewSeasonModal({
  seasonImg,
  seasonName,
  showModal,
  leagueName,
  leagueAlternateName,
  sportName,
  setShowModal,
  isLoading,
}: seasonModalData) {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(!showModal)}
      modalClass={`season-modal-container ${showModal ? "zoom-in" : ""}`}
    >
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="modal-body-container">
          <div className="img-league-container">
            <img
              className="season-img"
              width={300}
              height={300}
              src={"seasonImg"}
              alt="season-img"
            />
            <div className="season-details-container">
              <div className="league-details">
                <h3 className="league-name">{leagueName}</h3>
                <span className="sport-name">{sportName} 🏅</span>
              </div>
              <div className="season-details">
                <span className="league-alt-name">{leagueAlternateName}</span>
                <span className="season-name">{seasonName}</span>
              </div>
            </div>
          </div>
          <div className="modal-close-container">
            <button
              className="modal-close-button"
              onClick={() => setShowModal(!showModal)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
