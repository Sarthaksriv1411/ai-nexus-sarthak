
import { Link } from 'react-router-dom';
import './home.css'

const Homepage = () => {

   
    return (
        <div className='homepage'>
            <img src="/starbg.png" className="orbital" />
            <div className='left'>
                <h1>AI NEXUS</h1>
                <h2>Empowering Your Digital Future</h2>
                <h3>Discover cutting-edge AI solutions that enhance productivity, creativity, and efficiency. AI Nexus is your gateway to intelligent conversations, automation, and innovation. 🚀</h3>
                <Link to="/dashboard"> Get Started</Link>
                
            </div>
            <div className='right'>
                <div className='imgContainer'>
                    <div className='bgContainer'>
                        <div className='bg'>
                        </div>
                    </div>
                    <img src="/rocket.png" className="bot" />
                </div>

            </div>
        </div>
    );
};

export default Homepage;
