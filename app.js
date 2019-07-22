(function() {
    let storage = (JSON.parse(localStorage.getItem('this.newData')));
    console.log(storage);

    function generateLikeList() {
        const newDataPanel = document.getElementById('data-panel-favorite');
        let newHtmlContent = '';
        let newData = storage;
        console.log(newData);
        for (let i = 0; i < newData.length; i++) {
            let newDataItem = Object.values(newData)[i];
            newHtmlContent = `
            <div class="col-sm-4 moreBox blogBox">
                <div class="card mb-2">
                    <img class="card-img-top" src="${newDataItem.avatar}" alt="Card image cap">
                    <div class="card-body user-item-body">
                        <h5 class="item-name">${newDataItem.name} ${newDataItem.surname}</h5>
                        <h6>${newDataItem.region}</h6>
                        <h6 class="item-email">${newDataItem.email}</h6>
                    </div>
                </div>
            </div>
            `;
        }
        newDataPanel.innerHTML = newHtmlContent;
    };
})