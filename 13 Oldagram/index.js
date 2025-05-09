const posts = [
    {
        name: "Vincent van Gogh",
        username: "vincey1853",
        location: "Zundert, Netherlands",
        avatar: "images/avatar-vangogh.jpg",
        post: "images/post-vangogh.jpg",
        comment: "just took a few mushrooms lol",
        likes: 13 + 'M'
    },
    {
        name: "Gustave Courbet",
        username: "gus1819",
        location: "Ornans, France",
        avatar: "images/avatar-courbet.jpg",
        post: "images/post-courbet.jpg",
        comment: "i'm feelin a bit stressed tbh",
        likes: 21 + 'M'
    },
    {
        name: "Joseph Ducreux",
        username: "jd1735",
        location: "Paris, France",
        avatar: "images/avatar-ducreux.jpg",
        post: "images/post-ducreux.jpg",
        comment: "gm friends! which coin are YOU stacking up today?? post below and WAGMI!",
        likes: 11.3 + 'M'
    }
];

const feed = document.getElementById("post-feed");
const template = document.getElementById("post-template");

posts.forEach(post => {
    const clone = template.content.cloneNode(true);

    // Populate content
    clone.querySelector(".post-avatar").src = post.avatar;
    clone.querySelector(".post-avatar").alt = `${post.name} avatar`;
    clone.querySelector(".name").textContent = post.name;
    clone.querySelector(".location").textContent = post.location;
    clone.querySelector(".post-image").src = post.post;
    clone.querySelector(".post-image").alt = `Post by ${post.name}`;
    clone.querySelector(".likes").textContent = `${post.likes}`;
    clone.querySelector(".username").textContent = post.username;
    clone.querySelector(".comment").textContent = post.comment;

    // Add like functionality
    const heartIcon = clone.querySelector(".icon-heart");
    const postImage = clone.querySelector(".post-image");

    heartIcon.addEventListener("click", () => {
        heartIcon.classList.toggle("liked");
    });

    postImage.addEventListener("dblclick", () => {
        heartIcon.classList.add("liked");
    });

    // Append to feed
    feed.appendChild(clone);
});
