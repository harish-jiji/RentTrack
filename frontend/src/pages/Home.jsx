import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Slides from '../components/Slides';

function Home() {
    return (
        <>
            <Navbar />
            <Slides />
        </>
    );
}

export default Home;
