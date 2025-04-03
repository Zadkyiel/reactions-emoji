const firebaseConfig = {
  apiKey: "AIzaSyDotQs7GtGiMmQ-lRSao0rJIvgy0uBXpvI",
  authDomain: "forum-compteur-emoji.firebaseapp.com",
  projectId: "forum-compteur-emoji",
  storageBucket: "forum-compteur-emoji.appspot.com",
  messagingSenderId: "882504956103",
  appId: "1:882504956103:web:16d7b1f20b9579ff1766e2",
  databaseURL: "https://forum-compteur-emoji-default-rtdb.europe-west1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const reactions = [
  { key: 'love', label: '❤️' },
  { key: 'sad', label: '😭' },
  { key: 'laugh', label: '😂' },
  { key: 'shock', label: '😱' },
  { key: '100', label: '💯' },
  { key: 'no', label: '<img src="https://i.postimg.cc/nrJMVgBn/no.png" alt="No" width="20" height="20">' },
  { key: 'drama', label: '<img src="https://i.postimg.cc/1t6fQsgW/767784352138264628.webp" alt="Drama" width="20" height="20">' }
];

const style = document.createElement('style');
style.textContent = `
  .roxy-reaction-bar {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 18px;
    align-items: center;
  }
  .roxy-reaction {
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 4px;
    border-radius: 8px;
    padding: 2px 6px;
    background-color: rgba(255, 255, 255, 0.06);
    transition: background-color 0.3s;
  }
  .roxy-reaction:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
  .roxy-reaction img {
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
  .roxy-reaction-count {
    font-size: 12px;
    color: #ccc;
  }
`;
document.head.appendChild(style);

function addReactionsToPosts() {
  const posts = document.querySelectorAll('.post_post.postbody:not(.roxy-reactified)');
  if (!posts.length) {
    setTimeout(addReactionsToPosts, 1000);
    return;
  }

  posts.forEach(post => {
    post.classList.add('roxy-reactified');
    const postId = post.closest('[id^="p"]')?.id || 'post-' + Math.random().toString(36).substr(2, 9);
    const bar = document.createElement('div');
    bar.className = 'roxy-reaction-bar';

    reactions.forEach(({ key, label }) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'roxy-reaction';
      wrapper.innerHTML = `${label} <span class="roxy-reaction-count">0</span>`;

      const countSpan = wrapper.querySelector('.roxy-reaction-count');
      const reactionRef = db.ref(`reactions/${postId}/${key}`);

      reactionRef.on('value', snapshot => {
        const count = snapshot.val() || 0;
        countSpan.textContent = count;
      });

      wrapper.addEventListener('click', () => {
        reactionRef.transaction(current => (current || 0) + 1);
      });

      bar.appendChild(wrapper);
    });

    post.appendChild(bar);
  });
}

function waitForPostsAndReact() {
  setTimeout(addReactionsToPosts, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", waitForPostsAndReact);
} else {
  waitForPostsAndReact();
}
