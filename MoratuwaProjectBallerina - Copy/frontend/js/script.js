    window.addEventListener('DOMContentLoaded', () => {
      const intro = document.getElementById('intro');
      const container = document.getElementById('container');
      const signUpBtn = document.getElementById('signUp');
      const signInBtn = document.getElementById('signIn');

      // Initially hide login/signup container
      container.style.visibility = 'hidden';
      container.style.opacity = '0';

      // After 3 seconds fade out intro and show login/signup container
      setTimeout(() => {
        intro.classList.add('fade-out');
        setTimeout(() => {
          intro.style.display = 'none';
          container.style.visibility = 'visible';
          container.style.opacity = '1';
        }, 800);
      }, 3000);

      // Toggle sign up / sign in forms
      signUpBtn.addEventListener('click', () => {
        container.classList.add('right-panel-active');
      });
      signInBtn.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
      });

    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = signupForm.querySelectorAll('input');
      const name = inputs[0].value.trim();
      const email = inputs[1].value.trim();
      const password = inputs[2].value.trim();

      if (name && email && password) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.email === email)) {
          alert('User already exists. Please login.');
        } else {
          users.push({ name, email, password });
          localStorage.setItem('users', JSON.stringify(users));
          alert('Signed up successfully! Please login.');
          signupForm.reset();
          container.classList.remove('right-panel-active'); // switch to login form
        }
      } else {
        alert('Please fill in all fields.');
      }
    });



    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = loginForm.querySelectorAll('input');
      const email = inputs[0].value.trim();
      const password = inputs[1].value.trim();

      let users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        alert('Login successful!');
        localStorage.setItem('loggedInUser', JSON.stringify(user)); // optional
        window.location.href = 'index.html'; // redirect after login
      } else {
        alert('Invalid email or password.');
      }
    });



      // Show login by default if user already signed up
      const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
      if (storedUser) {
        container.classList.remove('right-panel-active');
      } else {
        container.classList.add('right-panel-active');
      }
    });
    function typeText(targetId, text, speed = 100) {
      const target = document.getElementById(targetId);
      if (!target) return;
      let index = 0;

      function type() {
        if (index < text.length) {
          target.innerHTML += text.charAt(index);
          index++;
          setTimeout(type, speed);
        }
      }

      type();
    }

    window.addEventListener('DOMContentLoaded', () => {
      typeText("head2", "Squid Game", 100);
    });
    setTimeout(() => {
      document.querySelector(".sec1").classList.add("visible");
    }, 500); // or delay based on text typing duration

    // typing effect
    function typeText(targetId, text, speed = 100) {
      const target = document.getElementById(targetId);
      let index = 0;

      function type() {
        if (index < text.length) {
          target.innerHTML += text.charAt(index);
          index++;
          setTimeout(type, speed);
        }
      }

      type();
    }
      const startBtn = document.getElementById('startBtn');
      const modalOverlay = document.getElementById('modalOverlay');
      const quizContainer = document.getElementById('quizContainer');
      const questionText = document.getElementById('questionText');
      const answersContainer = document.getElementById('answersContainer');
      const resultContainer = document.getElementById('resultContainer');
      const userRoleEl = document.getElementById('userRole');
      const percentageChart = document.getElementById('percentageChart');
      const closeBtn = document.querySelector('#quizModal .closeBtn');

      // Get or create a username
      let username = localStorage.getItem('quizUsername');
      if (!username) {
        username = "User_" + Date.now(); // Temporary unique username
        localStorage.setItem('quizUsername', username);
      }
      const questions = [
        {
          question: "What's your go-to strategy in a tense situation?",
          answers: [
            { text: "Stay calm and think carefully", role: "Player" },
            { text: "Follow orders without question", role: "Masked Guard" },
            { text: "Use cunning and trickery", role: "Front Man" },
            { text: "Watch and learn from the sidelines", role: "VIP" }
          ]
        },
        {
          question: "Which trait describes you best?",
          answers: [
            { text: "Courageous and bold", role: "Player" },
            { text: "Loyal and disciplined", role: "Masked Guard" },
            { text: "Mysterious and commanding", role: "Front Man" },
            { text: "Curious and entertained", role: "VIP" }
          ]
        },
        {
          question: "What's your favorite game to play?",
          answers: [
            { text: "Squid Game (obviously!)", role: "Player" },
            { text: "Hide and seek", role: "Masked Guard" },
            { text: "Chess - strategy wins", role: "Front Man" },
            { text: "Watching others play", role: "VIP" }
          ]
        },
        {
          question: "If you had to pick a color to represent yourself, what would it be?",
          answers: [
            { text: "Red - fearless and fiery", role: "Player" },
            { text: "Black - strict and powerful", role: "Masked Guard" },
            { text: "White - mysterious and pure", role: "Front Man" },
            { text: "Gold - rich and influential", role: "VIP" }
          ]
        }
      ];
    //Sorting into roles
      const roles = ["Player", "Masked Guard", "Front Man", "VIP"];
      let scores = { Player: 0, "Masked Guard": 0, "Front Man": 0, VIP: 0 };
      let currentQuestionIndex = 0;

      function loadRolePercentages() {
      fetch('http://localhost:3000/api/role-percentages')
        .then(res => res.json())
        .then(data => {
          const percentages = data.percentages;

          // Update left container
          for (const role of roles) {
            const el = document.getElementById({
              'Player': 'playerPercent',
              'Masked Guard': 'maskedPercent',
              'Front Man': 'frontmanPercent',
              'VIP': 'vipPercent'
            }[role]);
            if (el) el.textContent = `${Math.round(percentages[role] || 0)}%`;
          }
        })
        .catch(err => console.error('Error loading percentages:', err));
    }

    // Call it immediately on page load
    loadRolePercentages();
      

      function showQuestion(index) {
        questionText.textContent = questions[index].question;
        answersContainer.innerHTML = '';
        questions[index].answers.forEach(answer => {
          const btn = document.createElement('button');
          btn.textContent = answer.text;
          btn.addEventListener('click', () => {
            scores[answer.role]++;
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
              showQuestion(currentQuestionIndex);
            } else {
              showResult();
            }
          });
          answersContainer.appendChild(btn);
        });
      }

      function getUserRole() {
        let maxScore = -1;
        let chosenRole = '';
        for (const role of roles) {
          if (scores[role] > maxScore) {
            maxScore = scores[role];
            chosenRole = role;
          }
        }
        return chosenRole;
      }
    function showResult() {
        const userRole = getUserRole();

        //  Save the role to the backend using persistent username
        fetch('http://localhost:3000/api/save-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, role: userRole })
        })
        .then(response => response.json())
        .then(() => {
            //  Fetch updated percentages from backend
            return fetch('http://localhost:3000/api/role-percentages');
        })
        .then(response => response.json())
        .then(data => {
            const percentages = data.percentages; // { Player: "XX.X", "Masked Guard": "XX.X", ... }

            quizContainer.style.display = 'none';
            resultContainer.style.display = 'block';
            userRoleEl.textContent = userRole;
            percentageChart.innerHTML = '';

            // Update modal bars and left-side container percentages
            for (const role of roles) {
                const percentage = percentages[role] || 0;

                // Modal bar
                const barWrapper = document.createElement('div');
                const label = document.createElement('div');
                label.className = 'bar-label';
                label.textContent = `${role}: ${percentage}%`;
                const bar = document.createElement('div');
                bar.className = 'bar';

                switch (role) {
                    case 'Player': bar.style.backgroundColor = '#ff4c4c'; break;
                    case 'Masked Guard': bar.style.backgroundColor = '#222'; break;
                    case 'Front Man': bar.style.backgroundColor = '#ccc'; break;
                    case 'VIP': bar.style.backgroundColor = '#ffd700'; break;
                }

                bar.style.width = percentage + '%';
                barWrapper.appendChild(label);
                barWrapper.appendChild(bar);
                percentageChart.appendChild(barWrapper);

                // Left container update
                const idMap = {
                    'Player': 'playerPercent',
                    'Masked Guard': 'maskedPercent',
                    'Front Man': 'frontmanPercent',
                    'VIP': 'vipPercent'
                };
                const el = document.getElementById(idMap[role]);
                if (el) el.textContent = `${Math.round(percentage)}%`;
            }

            //  Reset for next quiz attempt
            currentQuestionIndex = 0;
            scores = { Player: 0, "Masked Guard": 0, "Front Man": 0, VIP: 0 };
        })
        .catch(err => console.error('Error updating role percentages:', err));
    }


      startBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
        resultContainer.style.display = 'none';
        quizContainer.style.display = 'flex';
        showQuestion(currentQuestionIndex);
      });

      closeBtn.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        currentQuestionIndex = 0;
        scores = { Player: 0, "Masked Guard": 0, "Front Man": 0, VIP: 0 };
      });

      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeBtn.click();
      });
    //progress button arrow
    const scrollBtn = document.getElementById('scrollToTopBtn');
    const progressCircle = document.getElementById('progressCircle');
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;

    function updateScrollProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;

      const offset = circumference - scrollPercent * circumference;
      progressCircle.style.strokeDashoffset = offset;

      // Show button after scrolling 100px
      scrollBtn.style.display = scrollTop > 100 ? 'flex' : 'none';
    }

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Listen to scroll event
    window.addEventListener('scroll', updateScrollProgress);

    const containers = document.querySelectorAll('.games');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      }, {threshold: 0.1});
      
      containers.forEach(container => {
        observer.observe(container);
      });
   
    // LOGIN FUNCTION
    
    async function login(email, password) {
        try {
            const res = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Email: email, Passwrod: password })
            });

            const data = await res.json();

            if (data.id) { // login successful
                window.loggedInUserId = data.id; // <--- store globally
                initPoll(data.id); // start poll flow for this user
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    }

  
    // INITIALIZE POLL FOR LOGGED-IN USER
 
    async function initPoll(userId) {
        try {
            // Fetch all votes from backend
            const res = await fetch('http://localhost:3000/vote');
            const votes = await res.json();

            // Check if this user has already voted
            const alreadyVoted = votes.some(v => v.user_id === userId);

            if (alreadyVoted) {
                showPollResults(userId); // show results only
            } else {
                // show voting buttons
                document.querySelector('.poll-options').style.display = 'block';
            }
        } catch (err) {
            console.error('Error initializing poll:', err);
        }
    }

    
    // SHOW POLL RESULTS
   
    async function showPollResults(userId) {
        try {
            const res = await fetch('http://localhost:3000/vote');
            const votes = await res.json();

            // Count votes
            let yesCount = 0, maybeCount = 0, noCount = 0;
            votes.forEach(v => {
                if (v.vote === 'yes') yesCount++;
                else if (v.vote === 'maybe') maybeCount++;
                else if (v.vote === 'no') noCount++;
            });

            const total = yesCount + maybeCount + noCount;
            const yesPercent = total ? Math.round((yesCount / total) * 100) : 0;
            const maybePercent = total ? Math.round((maybeCount / total) * 100) : 0;
            const noPercent = total ? Math.round((noCount / total) * 100) : 0;

            // Update bars
            document.getElementById('yesBar').style.width = yesPercent + '%';
            document.getElementById('maybeBar').style.width = maybePercent + '%';
            document.getElementById('noBar').style.width = noPercent + '%';

            // Update text
            document.getElementById('yesPercent').textContent = yesPercent + '%';
            document.getElementById('maybePercent').textContent = maybePercent + '%';
            document.getElementById('noPercent').textContent = noPercent + '%';

            // Show results and hide voting buttons
            document.getElementById('pollResults').style.display = 'block';
            document.querySelector('.poll-options').style.display = 'none';
        } catch (err) {
            console.error('Error fetching poll results:', err);
        }
    }

  
    // SUBMIT POLL
    
    async function submitPoll(choice, userId) {
        try {
            const voteRes = await fetch('http://localhost:3000/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vote: choice, userId: userId })
            });

            const voteData = await voteRes.json();

            // If user already voted, show alert and results
            if (voteData.message === 'You have already voted') {
                alert('You have already voted! Showing results...');
                showPollResults(userId);
                return;
            }

            // Otherwise, show updated results after voting
            showPollResults(userId);
        } catch (err) {
            console.error('Error submitting poll:', err);
        }
    }

    
    // ATTACH VOTE BUTTONS
   
    document.querySelectorAll('.poll-options button').forEach(button => {
        button.addEventListener('click', () => {
            const choice = button.dataset.choice;
            const userId = window.loggedInUserId; // ensure userId is from login
            submitPoll(choice, userId);
        });
    });


    // Animate elements that slide in from the left
    const animatedItems = document.querySelectorAll('.animate-left');

    const animateObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target); // Optional: stop observing after animation
        }
      });
    }, {
      threshold: 0.3
    });

    animatedItems.forEach(item => animateObserver.observe(item));

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.bottom >= 0
        );
      }

      function checkAnimation() {
        const elements = document.querySelectorAll('.slide-in-left, .slide-in-right');
        elements.forEach(el => {
          if (isInViewport(el)) {
            el.classList.add('show');
          }
        });
      }

      window.addEventListener('scroll', checkAnimation);
      window.addEventListener('load', checkAnimation);