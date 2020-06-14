import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

class Navigation extends Component {
    render() {
        return (
            <div className='navbar'>
                    <Link to ='/' className ="heading">HOME</Link>
                    <Link to='/RequestDoctor'>APPLY FOR DOCTOR</Link>
                    <Link to='/AddAlternative'>+ADD ALTERNATIVE</Link>
                    <Link to='/GetAlternatives'>GET ALTERNATIVE</Link>
                </div>
        );
    }
}

export default Navigation;