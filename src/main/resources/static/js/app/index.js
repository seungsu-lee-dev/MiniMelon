var main = {
    init : function () {
        let _this = this;
        let isPlaying = false;
        let initialUri = "https://www.youtube.com/results?search_query=";
        let searchIndex = 0;
        let musicList;
        let playListName = "";
        let playList = "";
        $('#btn-save').on('click', function () {
            _this.save();
        });
        $('#btn-update').on('click', function () {
            _this.update();
        });
        $('#btn-delete').on('click', function () {
            _this.delete();
        });
        $('#btn-playPause').on('click', function () {
            if (musicList==null) {
                alert("노래를 검색해주세요");
            }
            else if (!isPlaying) {
                $('#player')[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                isPlaying = true;

                let singer = document.getElementById('singer').value;
                let songTitle = document.getElementById('songTitle').value;
                let searchUri = "";

                searchUri = initialUri + singer + "+" + songTitle;
                autoList = _this.autoplaysave(searchUri);
                _this.overlayInfo(autoList, searchIndex);
            }
            else {
                $('#player')[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                isPlaying = false;
            }
        });


        $('#btn-search').on('click', function () {
            let singer = document.getElementById('singer').value;
            let songTitle = document.getElementById('songTitle').value;
            let searchUri = "";
            if (!singer) {
                alert("가수를 입력해주세요");
                document.getElementById('singer').focus();
            }
            else if (!songTitle) {
                alert("제목을 입력해주세요");
                document.getElementById('songTitle').focus();
            }
            else {
                searchUri = initialUri + singer + "+" + songTitle;
                musicList = _this.searchMusic(searchUri);
                searchIndex = 0;
                _this.overlayInfo(musicList, searchIndex);
            }
        });
        $('#btn-nextMusic').on('click', function () {
            if (musicList==null) {
                alert("노래를 검색해주세요");
                return;
            }
            else if (searchIndex==(musicList.length-1)) {
                alert("마지막 영상입니다");
                return;
            }
            isPlaying = false;
            _this.overlayInfo(musicList, ++searchIndex);
        });
        $('#btn-previousMusic').on('click', function () {
            if (musicList==null) {
                alert("노래를 검색해주세요");
                return;
            }
            else if (!searchIndex) {
                alert("처음 영상입니다");
                return;
            }
            isPlaying = false;
            _this.overlayInfo(musicList, --searchIndex);
        });

        $('#btn-putMusic').on('click', function () {
            if (musicList==null) {
                alert("노래를 선택해주세요");
            }
            else {
                _this.myplaysave(playListName);
                const selectBody = document.querySelector("#sbody");
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                td.innerText = document.getElementById('videoTitle').innerText;
                tr.appendChild(td);
                selectBody.appendChild(tr);
            }
        });

        $('#btn-createList').on('click', function listInput(newListName) {
            var newListName = prompt('... 새로운 플레이리스트 이름을 입력하세요 ...');
            alert(newListName);

            if(newListName == "") {
                alert('새로운 플레이리스트 이름을 입력하세요.');
                return;
            }
            else {
                _this.listInput(newListName);
                alert('새로운 플레이리스트를 생성하였습니다.');
                _this.mainlistInput(newListName);
                _this.myplaysave(newListName);
            }
        });

        $('.hideA').on('click', function () {
            document.getElementById("mTable").setAttribute("style", "display:none");
            document.getElementById("lTable").setAttribute("style", "display:");
            playListName = $(this).text().trim();
            console.log("playListName: " + playListName);

            const selectBody = document.querySelector("#sbody");
            console.log("selectBody: " + selectBody);

            playList = _this.selectlistInput(playListName);

            console.log(playList[0]);
            console.log(playList[0].videoTitle);
            let playListLength = Object.keys(playList).length;
            console.log("playListLength: " + playListLength);

            for (let i=0;i<playListLength;i++) {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                td.innerText = playList[i].videoTitle;
                tr.appendChild(td);
                selectBody.appendChild(tr);
            }
        });
    },
    save : function () {
        var data = {
            title: $('#title').val(),
            author: $('#author').val(),
            content: $('#content').val()
        };

        $.ajax({
            type: 'POST',
            url: '/api/v1/posts',
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            data: JSON.stringify(data)
        }).done(function() {
            alert('글이 등록되었습니다.');
            window.location.href = '/';
        }).fail(function (error) {
            alert(JSON.stringify(error));
        });
    },
    update : function () {
        var data = {
            title: $('#title').val(),
            content: $('#content').val()
        };

        var id = $('#id').val();

        $.ajax({
            type: 'PUT',
            url: '/api/v1/posts/'+id,
            dataType: 'json',
            contentType:'application/json; charset=utf-8',
            data: JSON.stringify(data)
        }).done(function() {
            alert('글이 수정되었습니다.');
            window.location.href = '/';
        }).fail(function (error) {
            alert(JSON.stringify(error));
        });
    },
    delete : function () {
        var id = $('#id').val();

        $.ajax({
            type: 'DELETE',
            url: '/api/v1/posts/'+id,
            dataType: 'json',
            contentType:'application/json; charset=utf-8'
        }).done(function() {
            alert('글이 삭제되었습니다.');
            window.location.href = '/';
        }).fail(function (error) {
            alert(JSON.stringify(error));
        });
    },
    searchMusic : function (uriValue) {
        var data = {
            uri: uriValue
        };
        var obj;
        $.ajax({
           type: 'POST',
            url: '/musicPlay',
            // dataType: 'string',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            async: false
        }).done(function(data) {
            console.log("searchValue: "+data);
            obj = JSON.parse(data);
            console.log(obj[0].thumbnailLink);
            console.log(obj[0].videoLink);
            console.log(obj[0].videoTitle);
        }).fail(function(error) {
            console.log(error);
        });
        return obj;
    },

     autoplaysave : function (saveValue){
        var data = {
            uri: saveValue
        };
        var obj;
        $.ajax({
            type: 'POST',
            url: '/autoPlaysave',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            async: false
        }).done(function(data) {
            console.log("autoPlayValue: "+data);
            obj = JSON.parse(data);
//            console.log(obj[0].videoTitle);
//            console.log(obj[0].videoLink);
//            console.log(obj[0].thumbnailLink);
        }).fail(function(error) {
            console.log(error);
        });
        return obj;
    },

    myplaysave : function (newListName){
        var data = {
            String : newListName,
            thumbnailLink:document.getElementById('thumbnail').getAttribute('src'),
            videoTitle:document.getElementById('videoTitle').innerText,
            videoLink:document.getElementById('player').getAttribute('src')
        };
        var obj;
        $.ajax({
            type: 'POST',
            url: '/myPlaysave',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            async: false
        }).done(function(data) {
            console.log("myPlayValue: "+data);
            obj = JSON.parse(data);
            console.log(obj.videoTitle);
            console.log(obj.videoLink);
            console.log(obj.thumbnailLink);
        }).fail(function(error) {
            console.log(error);
        });
        return obj;
    },

    listInput : function (newListName) {
        var data = {
            String : newListName
        };

        var obj;
        $.ajax({
            type: 'POST',
            url: '/createTable',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
        }).done(function() {
//            alert('테이블이 생성되었습니다.');
            window.location.href = '/';
        }).fail(function (error) {
            alert(JSON.stringify(error));
        });
        },

    mainlistInput : function(newListName) {
        var data = { String : newListName };
        var obj;
        $.ajax({
            type: 'POST',
            url: '/insertListTable',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            async: false
        }).done(function() {
            window.location.href = '/';
        }).fail(function(error) {
            console.log(error);
        });
         return obj;
    },

    selectlistInput : function(newListName) {
        var data = { String : newListName };
        var obj;
        $.ajax({
            type: 'POST',
            url: '/selectTable',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            async: false
        }).done(function(data) {
            obj = JSON.parse(data);
        }).fail(function(error) {
            console.log(error);
        });
        return obj;
    },


    overlayInfo : function (musicJson, index) {
        document.getElementById("thumbnail").setAttribute("src", musicJson[index].thumbnailLink);
        document.getElementById("videoTitle").innerText = musicJson[index].videoTitle;
        let link = "https://www.youtube.com/embed/" + musicJson[index].videoLink + "?autoplay=0&amp;rel=0&amp;showinfo=0&amp;showsearch=0&amp;controls=0&amp;enablejsapi=1&amp;playlist=" + musicJson[index].videoLink;
        document.getElementById("player").setAttribute("src", link);
    },

    hideTable : function () {
        document.getElementById("hideTr").setAttribute("style", "display:none");
    }
};
main.init();