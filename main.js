(function() {
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com';
    const INDEX_URL = BASE_URL + '/api/v1/users/'; //index api
    const data = [];
    const posts = [
        "Do you need a wetsuit where you surf?",
        "Killer black and grey work from @rubentattooer using #killerinktattoo supplies!",
        "Archipelago Li Galli, off the Amalfi coast",
        "Did somebody say... road trip??",
        "Jesus bro eternal life that goes on even when all this is done",
        "Summer vibes 💙 Gythion, Greece. Photos by",
        "Vibing out with with the W van 🤙🚐☀️",
        "One of the greatest cities in the world to visit! - Istanbul, Turkey!",
        "What's your favorite city to visit?? Comment below!",
        "Tag a friend looking for their next travel idea!",
        "Double tap if you'll looking for your next travel destination!",
        "the one that always makes me laugh ❤️",
        "Beautiful sunrise at Bondi certainly lifts your early morning swim session 🏊‍♀️🏊‍♂️",
        "The beauty of Dubai Marina, United Arab Emirates.",
        "Morning ride in paradise 💙 Maldives. ",
        "The Maison's great classic, the Question Mark necklace is decorated here with acanthus leaves in a flowing tribute to the architectural beauty of Paris and the beauty of nature.",
        "TSHIRTS HOODIES DECALS etsy ViclaCartelDesigns pay no shipping in the US EVER. except Hawaii. international shipping available "
    ];

    const dataPanel = document.getElementById('data-panel');
    const searchForm = document.getElementById('search');
    const searchInput = document.getElementById('search-input');
    const pagination = document.getElementById('pagination');
    const viewTheme = document.getElementById('view');
    const ITEM_PER_PAGE = 12;

    let paginationData = [];

    this.storage = [];
    this.storePage = 1;
    this.storePosts = [];
    this.stroeKeyVal = JSON.parse(localStorage.getItem('keyVal')) || {};


    axios.get(INDEX_URL).then((response) => {
        data.push(...response.data.results);
        getPageData(1, data);
        getTotalPages(data);
    }).catch((err) => console.log(err));

    dataPanel.addEventListener('click', (event) => {
        const scoreCal = document.getElementsByClassName('scoreCal');
        let changeFavEmoji = event.target;
        if (event.target.matches('.btn-show-user')) {
            showUserModal(event.target.dataset.id);
        } else if (event.target.matches('.btn-add-favorite')) {
            if (dataPanel.classList.contains('list-group') !== true) {
                let shownFollow = event.target.parentElement.parentElement.parentElement.children[0].children[0];
                shownFollow.insertAdjacentText('beforeend', ' • Favorite');
            } else if (dataPanel.classList.contains('list-group') === true) {
                let shownFollow = event.target.parentElement.parentElement.parentElement.children[1].children[0];
                shownFollow.insertAdjacentText('beforeend', ' • Favorite');
            }
            addFavoriteItem(event.target.dataset.id);
            changeFavEmoji.classList.remove('far');
            changeFavEmoji.classList.add('fas');
        } else if (event.target.matches('.fa-heart')) {
            changeFavEmoji.classList.remove('far');
            changeFavEmoji.classList.add('fas');
        } else if (event.target.matches('.fa-angle-double-down')) {
            displayLocalPosters(event.target.dataset.id); // 由localstorage data產生使用者留言紀錄
            changeFavEmoji.classList.remove('fa-angle-double-down');
            changeFavEmoji.classList.add('fa-angle-double-up');
        } else if (event.target.matches('.fa-angle-double-up')) {
            let hideContent = event.target.parentElement.parentElement.children[2].children;
            for (let i = 0; i < hideContent.length; i++) {
                hideContent[i].style.display = 'none';
            }
            changeFavEmoji.classList.remove('fa-angle-double-up');
            changeFavEmoji.classList.add('fa-angle-double-down');
        }
    });

    dataPanel.addEventListener('submit', (event) => {
        event.preventDefault();
        let commentForm = event.target;
        let itemId = event.target.parentElement.parentElement.children[0].children[3].textContent;
        let commentObj = event.target.children[0].children[1];
        const stroeKeyVal = {};
        if (event.target.matches('#form')) {
            if (!commentForm.checkValidity()) {
                event.stopPropagation();
                commentForm.classList.add('was-validated');
            } else {
                commentForm.classList.remove('was-validated');
                localStorage.setItem('usersKeys', itemId);
                if (Object.keys(this.stroeKeyVal).indexOf(itemId) !== -1) { // 判斷使用者ID已存在，有的話就不需要創一個arrry
                    this.stroeKeyVal[itemId].push(commentObj.value); // 利用this.stroeKeyVal[itemId]抓到對應使用者再push資料進去
                    localStorage.setItem('keyVal', JSON.stringify(this.stroeKeyVal));
                } else {
                    this.stroeKeyVal[localStorage.getItem('usersKeys')] = []; // 創一個資料結構 {id: []}
                    this.stroeKeyVal[itemId].push(commentObj.value); // 利用this.stroeKeyVal[itemId]抓到對應使用者再push資料進去
                    localStorage.setItem('keyVal', JSON.stringify(this.stroeKeyVal));
                }
                generateFormList(event.target.dataset.id); //產生留言輸入框內容
                commentForm.reset();
            }
        }
    });

    // 切換地址和信件icon是為了避免重複點選
    dataPanel.addEventListener('mouseover', (event) => {
        let locationshow = event.target.parentElement.children[1];
        let emailShow = event.target.parentElement.children[2];
        let changeFavEmoji = event.target;
        if (event.target.matches('.fa-map-marker-alt') && event.target.matches('.far')) {
            if (dataPanel.classList.contains('list-group') !== true) {
                let locationInfo = event.target.parentElement.parentElement.parentElement.children[0].children[1];
                locationshow.insertAdjacentText('beforeend', locationInfo.textContent);
            } else if (dataPanel.classList.contains('list-group') === true) {
                let locationInfo = event.target.parentElement.parentElement.parentElement.children[1].children[1];
                locationshow.insertAdjacentText('beforeend', locationInfo.textContent);
            }
            changeFavEmoji.classList.remove('far', 'fa-map-marker-alt');
            changeFavEmoji.classList.add('fas', 'fa-map-marker');
            locationshow.style.color = 'red';
        } else if (event.target.matches('.fa-envelope') && event.target.matches('.far')) {
            if (dataPanel.classList.contains('list-group') !== true) {
                let emailInfo = event.target.parentElement.parentElement.parentElement.children[0].children[2];
                emailShow.insertAdjacentText('beforeend', emailInfo.textContent);
            } else if (dataPanel.classList.contains('list-group') === true) {
                let emailInfo = event.target.parentElement.parentElement.parentElement.children[1].children[2];
                emailShow.insertAdjacentText('beforeend', emailInfo.textContent);
            }
            changeFavEmoji.classList.remove('far');
            changeFavEmoji.classList.add('fas');
            emailShow.style.color = 'red';
        }
    });

    dataPanel.addEventListener('mouseout', (event) => {
        let locationshow = event.target.parentElement.children[1];
        let emailShow = event.target.parentElement.children[2];
        let changeFavEmoji = event.target;
        if (event.target.matches('.fa-map-marker') && event.target.matches('.fas')) {
            locationshow.textContent = '';
            changeFavEmoji.classList.add('far', 'fa-map-marker-alt');
            changeFavEmoji.classList.remove('fas', 'fa-map-marker');
            locationshow.style.color = 'black';
        } else if (event.target.matches('.fa-envelope') && event.target.matches('.fas')) {
            emailShow.textContent = '';
            changeFavEmoji.classList.add('far');
            changeFavEmoji.classList.remove('fas');
            emailShow.style.color = 'black';
        }
    });

    searchForm.addEventListener('submit', event => {
        let results = [];
        const regex = new RegExp(searchInput.value, 'i');
        event.preventDefault();
        results = data.filter(users => users.name.match(regex));
        console.log(results);
        getPageData(1, results);
    });

    pagination.addEventListener('click', event => {
        console.log(event.target.dataset.page);
        if (event.target.tagName === 'A') {
            getPageData(event.target.dataset.page);
            this.storePage = event.target.dataset.page;
            console.log(this.storePage);
        }
    });

    viewTheme.addEventListener('click', (event) => {
        let currentPage = this.storePage;
        if (event.target.classList.contains('fa-th')) {
            dataPanel.classList.remove('list-group');
            getPageData(currentPage);
        } else if (event.target.classList.contains('fa-list')) {
            dataPanel.classList.add('list-group');
            getPageData(currentPage);
        }
    });

    function getTotalPages(data) {
        let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1;
        let pageItemContent = '';
        for (let i = 0; i < totalPages; i++) {
            pageItemContent += `
            <li class="page-item">
                <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
            </li>
            `;
        }
        pagination.innerHTML = pageItemContent;
    };

    function getPageData(pageNum, data) {
        paginationData = data || paginationData;
        let offset = (pageNum - 1) * ITEM_PER_PAGE;
        let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE);
        if (dataPanel.classList.contains('list-group') !== true) {
            displayDataList(pageData);
        } else if (dataPanel.classList.contains('list-group') === true) {
            displayListView(pageData);
        }
    };

    function displayDataList(data) {
        let htmlContent = '';
        let randomPosts = Math.floor((Math.random() * posts.length));
        data.forEach(item => {
            htmlContent += `
            <section class="col-sm-6 form-input">
                <div class="card mb-2">
                    <img class="card-img-top" src="${item.avatar}" alt="Card image cap">
                    <div class="center">
                        <button class="btn btn-primary btn-show-user" data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">More</button>
                    </div>
                </div>
            </section>
            <section class="col-sm-6 form-output">
                <div class="card-body user-item-body">
                    <h5 class="item-name">${item.name} ${item.surname}</h5>
                    <h6 style="display:none;">${item.region}</h6>
                    <h6 class="item-email" style="display:none;">${item.email}</h6>
                    <h6 style="display:none;">${item.id}</h6>
                </div>
                <div class="users-posts">
                    <h6 class="item-name">${item.name} ${item.surname}</h6>
                    <h6 class="posts-details">${posts[randomPosts]}</h6>
                    <span class="far fa-angle-double-down"> History </span>
                </div>
                <div class="form-body">
                </div>
                <div class="user-icon" id="user-icon">
                    <div class="icon-group">
                        <span class="far fa-heart"></span>
                        <span class="far fa-map-marker-alt"></span>
                        <span class="far fa-envelope"></span>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-link btn-add-favorite far fa-bookmark" data-id="${item.id}"></button>
                    </div>
                </div>
                <div class="modal-footer">
                    <form class="input-group" action="" name="form col-sm-6 validation" id="form" data-id="${item.id}" novalidate>
                        <div class="form-group" id="comment">
                            <label class="sr-only" for="commentContent"></label>
                            <input type="text" id="commentContent" class="form-control" placeholder="Add your comment" aria-label="Add your comment" aria-describedby="button-addon2" required>
                        </div>
                        <div class="form-group input-group-append">
                            <button class="btn btn-outline-secondary" type="submit" id="button-addon2" data-action="submit">Post</button>
                        </div>
                    </form>
                </div>
            </section>
            `;
        })
        dataPanel.innerHTML = htmlContent;
    }

    function displayListView(data) {
        let htmlContent = '';
        data.forEach(function(item, index) {
            htmlContent += `
            <div class="moreBox blogBox">
                <div class="">
                    <img class="hide-img" src="${item.avatar}" alt="Card image cap">
                    <div class="card-body user-item-body">
                        <h5 class="item-name">${item.name} ${item.surname}</h5>
                        <h6>${item.region}</h6>
                        <h6 class="item-email">${item.email}</h6>
                    </div>
                    <div class="user-icon" id="user-icon">
                        <div class="icon-group">
                            <span class="far fa-heart"></span>
                            <span class="far fa-map-marker-alt"></span>
                            <span class="far fa-envelope"></span>
                        </div>
                        <div class="button-group">
                            <button class="btn btn-link btn-add-favorite far fa-bookmark" data-id="${item.id}"></button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        })
        dataPanel.innerHTML = htmlContent;
    };

    function displayLocalPosters(id) {
        let itemId = event.target.parentElement.parentElement.children[0].children[3].textContent;
        let postersData = this.stroeKeyVal[itemId];
        const formGen = event.target.parentElement.parentElement.children[2];
        const postersId = event.target.parentElement.children[0].textContent;
        for (let j = 0; j < postersData.length; j++) {
            formGen.innerHTML += `
            <div class="card-body user-item-body form-content">
                <div class="poster-list">
                    <h6 class="poster-contents">${postersId} - ${postersData[j]}</h6>
                    <i class="far fa-heart poster-icon"></i>
                </div>
            </div>
            `;
        }
    };

    function generateFormList(id) {
        const formGen = event.target.parentElement.parentElement.children[2];
        const commentField = event.target.children[0].children[1];
        formGen.innerHTML += `
        <div class="card-body user-item-body form-content pull-right">
            <div class="poster-list">
                <h6 class="poster-contents">${commentField.value}</h6>
                <i class="far fa-heart poster-icon"></i>
            </div>
        </div>
        `;
    };

    function showUserModal(id) {
        const modalTitle = document.getElementById('show-user-title');
        const modalImg = document.getElementById('show-user-image');
        const modalRegion = document.getElementById('show-user-region');
        const modalEmail = document.getElementById('show-user-email');
        const url = INDEX_URL + id; //According to API doc
        axios.get(url).then((response) => {
            // different data comapre to the one in global, an object in here
            const data = response.data;
            modalTitle.textContent = data.name + ' ' + data.surname;
            modalImg.innerHTML = `<img src="${data.avatar}" class="img-fluid" alt="Responsive image">`;
            modalRegion.textContent = `Country: ${data.region}`;
            modalEmail.textContent = `E-mail: ${data.email}`;
        }).catch((err) => {
            alert(err);
        })
    };

    function addFavoriteItem(id) {
        const list = JSON.parse(localStorage.getItem('favoriteUsers')) || [];
        const user = data.find(item => item.id === Number(id));
        if (list.some(item => item.id === Number(id))) {
            alert(`${user.name} is already in your favorite list`);
        } else {
            list.push(user);
            alert(`Added ${user.name} to your favorite list!`);
        }
        localStorage.setItem('favoriteUsers', JSON.stringify(list));
    };


})();