import React from 'react';

export
default React.createClass({
    render() {
        return (
            <div className="col-md-10 col-md-offset-1">
                <div id="website-live" className="article">
                    <h1>New website is live!</h1>
                    <div className="date">July 22, 2015 | <span className="name">Pouja</span></div>
                    <p>Our new website with the new logo are live. We worked hard together with <a href="http://www.zokodesign.com">Zoko</a> to set up the new lay out of the website. Zoko also made the new logos:</p>
                    <div className="row">
                        <div className="col-md-5">
                            <img className="grey-bg" src="img/logorood.svg"/>
                        </div>
                        <div className="col-md-5 col-md-offset-1">
                            <img className="grey-bg" src="img/logowit.svg"/>
                        </div>
                    </div>
                    <p>All the news, blogs and latest changes will be posted on the website from now on. So make sure to follow the website. We will still send the newsletters, which will be also posted on the news page.</p>
                    <p>A new feature we are working on is the agenda system. In this system it will be possible with your credentials to see who is going to train when. It will also be possible to indicate that you want to train with someone. It will be an awesome feature!</p>
                </div>
                <div id="newsletter2" className="article">
                    <h1>News letter #2</h1>
                    <div className="date">June 10, 2015 | <span className="name">Ruud</span></div>
                    <p>Dear krachtpatser/powerhouse,</p>
                    <p>It has been a while since our last update, but we want you to know we're still active and lifting heavy weights! The 'Sterkste Student van Delft' was a great success, with 20 contestants! We are excited to organize it again next year.</p>

                    <h4>Start of our Club</h4>
                    <p>We've decided to start our club off slow by training in the VKR (the strength room outside the Sports Centre, near the gate) once a week on Saturday with our members, to get to know each other and discuss what we want to see happen in the club. In the upcoming year we hope to gain a lot of new, enthusiastic members. Eventually our goal is to have monthly seminars, and multiple strength sport events per year. Talk to us in the gym or reply to this email if you're interested in becoming a member of our lovely club, or have some great ideas!</p>

                    <h4>Website</h4>
                    <p>We are currently in the process of updating our website: ijzersterkdelft.nl. In the future the website will host blogs and an agenda application which shows who's available for instruction in the gym or when your buddies are training.</p>

                    <h4>Wiki</h4>
                    <p>The website is already hosting a wiki about Strength Sports and all it's aspects, we want to expand this to a big knowledge base, supervised by our club. The goal of the wiki is to have easy access to useful knowledge in an easy, straight forward format for beginners, intermediates and advanced lifters. Check out our wiki at: wiki.ijzersterkdelft.nl.</p>
                    <h4>Some pictures of the 'Sterkste Student van Delft'</h4>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="thumbnail">
                                <img src="http://www.ijzersterkdelft.nl/images/150322/20150322-163628.jpg"/>
                                <div class="caption">
                                    Arnela, the Strongest female student of Delft
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="thumbnail">
                                <img src="http://www.ijzersterkdelft.nl/images/150322/20150322-163403.jpg"/>
                                <div class="caption">
                                    Auke, the Strongest male student of Delft
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="thumbnail">
                                <img  src="http://www.ijzersterkdelft.nl/images/150322/20150322-171822.jpg"/>
                                <div class="caption">
                                    The IJzersterk board at the award ceremony
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>With powerful regards,<br/>
                    Board of DSKV IJzersterk</p>
                </div>
                <div id="sterkstestudent2015" className="article">
                    <h1>Sterkste Student(e) van Delft</h1>
                    <div className="date">February 20, 2015 | <span className="name">Daniël</span></div>
                    <p>IJzersterk organises the powerlifting competition: 'De sterkste Student(e) van delft' (translated: The Strongest Student in Delft), which will take place on March 22 from 09:30 till 17:30 in hall 3 in the sport centre of the TU Delft.</p>
                    <p>The competition is open for anyone, but be quick because there are limited slots available.</p>
                    <p>It will be exciting and awesome day where you can show your strength and proof that you are the strongest student in Delft. The competition exists of three parts: the squat, the bench press and the deadlift in that order. Your score will be calculated by taking the total of the three lifts and multiplied by the wilks coefficient, which is based on your gender and body weight.</p>
                    <p>For each of the three lifts we will give a short demonstration on how to perform the lift correctly, safely and in the most efficient way.</p>
                    <p>You can register for the event <a href="http://sc.tudelft.nl/nl/agenda/event/detail/223-delfts-strongest-student-mf/">here</a>, there is also a 5 euro fee to cover the costs of the materials.
                    If you do not have a NetID then you can register at the information desk of sport centre. Also make sure to invite your friends and family members to cheer for you!</p>
                    <p><a href="http://www.ijzersterkdelft.nl/index.php/nl/8-nl/14-sterkstestudent-nl">You can find more information here on the event</a></p>
                </div>
            </div>);
    }
});
