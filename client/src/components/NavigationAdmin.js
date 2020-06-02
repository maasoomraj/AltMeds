import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

class NavigationAdmin extends Component {
    render() {
        return (
            <div className='navbar'>
                    <div className="Admin">ADMIN</div>
                    <Link to ='/' className ="heading">HOME</Link>
                    <Link to='/RequestDoctor'>APPLY FOR DOCTOR</Link>
                    <Link to='/VerifyDoctor'>VERIFY DOCTOR</Link>
                    <Link to='/AddAlternative'>ADD ALTERNATIVE</Link>
                    <Link to='/GetAlternatives'>GET ALTERNATIVE</Link>
                </div>
        );
    }
}

export default NavigationAdmin;