import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import { getTicket, closeTicket } from '../features/tickets/ticketSlice';
import { getNotes, reset as notesReset } from '../features/notes/noteSlice';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import NoteItem from '../components/NoteItem';
import { FaPlus } from 'react-icons/fa';

const customStyles = {
  content: {
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    position: 'relative',
  },
};

Modal.setAppElement('#root');

function Ticket() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  // for ticket
  const { ticket, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.tickets
  );

  // for note
  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );

  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ticketId } = useParams();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
    // eslint-disable-next-line
  }, [isError, message, ticketId]);

  // close ticket handler
  const ticketCloseHandler = () => {
    dispatch(closeTicket(ticketId));
    toast.success('Ticket Closed');
    navigate('/tickets');
  };

  // submit note
  const noteSubmitHandler = (e) => {
    e.preventDefault();
    console.log('submit note');
    closeModalHandler();
  };

  // open modal
  const openModalHandler = () => setModalIsOpen(true);
  // close modal
  const closeModalHandler = () => setModalIsOpen(false);

  if (isLoading || notesIsLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h3>Something Went Wrong</h3>;
  }

  return (
    <div className='ticket-page'>
      <header className='ticket-header'>
        <BackButton url='/tickets' />
        {/* ticket id and status */}
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        {/* submitted date */}
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
        </h3>
        {/* product name */}
        <h3>Product: {ticket.product}</h3>
        <hr />
        {/* ticket diescription */}
        <div className='ticket-desc'>
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {ticket.status !== 'closed' && (
        <button onClick={openModalHandler} className='btn'>
          <FaPlus /> Add Note
        </button>
      )}

      {/* modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalHandler}
        style={customStyles}
        contentLabel='Add Note'
      >
        <h2>Add Note</h2>
        <button className='btn-close' onClick={closeModalHandler}>
          X
        </button>
        <form onSubmit={noteSubmitHandler}>
          {/* note textarea */}
          <div className='form-group'>
            <textarea
              name='noteText'
              id='noteText'
              className='form-control'
              placeholder='Note text'
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          {/* submit button */}
          <div className='form-group'>
            <button className='btn' type='submit'>
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}

      {ticket.status !== 'closed' && (
        <button
          onClick={ticketCloseHandler}
          className='btn btn-block btn-danger'
        >
          Close Ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
