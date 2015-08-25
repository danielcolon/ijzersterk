import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
    render(){
        return (<div className="col-md-8 col-md-offset-2 col-xs-12">
          <h1>The association</h1>
          <div className="subheader">DSVK IJzersterk</div>
          <p>We: Daniël Colon, Ruud Kassing, Pouja Nikray and Daniël Schooneveld, started the association with the following goals:</p>
          <ol>
            <li>To share reliable and trustworthy information about strength training in general.</li>
            <li>To share knowledge and expertise between athletes of different disciplines.</li>
            <li>To participate in competitions together.</li>
            <li>To give seminars and trainings.</li>
            <li>And most of all: to train together and to motivate each other in accomplishinging our personal goal(s).</li>
          </ol>

          <p>These points are what we offer to you when you <Link to="newmember">join</Link> the association. Each Saturday we can train at the VKR (next to the entrance of the Sports Unit), there we can help you with technique and other issues.</p>

          <div className="subheader">The sports</div>
          <p>The sports that are practised within the association are powerlifting, olympic weightlifting and strongman.</p>
          <p>We currently have three participants at the Flexcup NK Raw Powerlifting, where Daniël Schooneveld even has squat record of 212.5 kg at the 83- kg class. In the near future we will join the Flexcup NK Raw with more members and hopefully also be present at the other two sports at nationals.</p>

          <div className="subheader">The Wiki</div>
          <p>Because the knowledge about training, diet and other aspects of strength training are important and there is a vast amount of (mis)information, we want to be a source of reliable information. We try to achieve this by maintaining <a href="#">the Wiki</a> which will give you a starting point where you can find trustworthy information and general information about strength training. Blogs and seminars will also be used to attain this goal.</p>
        </div>);
    }
});
