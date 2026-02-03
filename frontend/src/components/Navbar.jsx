import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Properties from '../pages/common/Properties';

function Heading() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>

        {/* Brand */}
        <Navbar.Brand as={Link} to="/">
          <strong>RentTrack</strong>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="renttrack-navbar" />

        <Navbar.Collapse id="renttrack-navbar">
          <Nav className="me-auto">
            {!user && <Nav.Link as={Link} to="/">Home</Nav.Link>}

            {/* Show different links based on role */}
            {user && user.role === 'ADMIN' && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/admin/properties">All Properties</Nav.Link>
              </>
            )}

            {user && user.role === 'USER' && (
              <>
                <Nav.Link as={Link} to="/user/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/properties">Browse Properties</Nav.Link>
              </>
            )}

            {!user && (
              <Nav.Link as={Link} to="/properties">Properties</Nav.Link>
            )}

          </Nav>

          <Nav>
            {user ? (
              <NavDropdown title={`Hello, ${user.username || 'User'}`} id="account-menu" align="end">
                <NavDropdown.Item as={Link} to={user.role === 'ADMIN' ? "/admin/profile" : "/user/profile"}>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}

          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Heading;
