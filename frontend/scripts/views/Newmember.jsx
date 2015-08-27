import React from 'react';

export default React.createClass({
    shouldComponentUpdate() {
        return false;
    },
    render(){
        return (<div className="col-md-8 col-md-offset-2 col-xs-12">
            <h1>Joining the association</h1>
            <p>You can join DSKV IJzersterk by filling out <a href="https://docs.google.com/forms/d/1YzjtQxjKTAcaJh8SCVK1rlBuRQH2FuoV6KrkkDNy6cg/viewform">this Google form</a>. After that we will arrange a meeting with the current board. The board will like to get to know you better and to see where you are currently standing, what you goals are and what we expect from you and what you expect from us. The last step will then be to buy (obligatory when joining IJzersterk) the t-shirt.</p>
            <p>With the t-shirt in hand and after meeting with the board you will be able train together with us at the VKR and gain access to the Wiki and make use of the agenda system. Furthermore we also hold the Strongest Student competition each year which can be a great moment to test your strength when you join us!</p>

            <p>Remember: at IJzesterk it is not important where you are, but how hard you are willing to work to achieve your goal(s).</p>
        </div>);
    }
});
