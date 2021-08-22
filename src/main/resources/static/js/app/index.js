var main = {
    init : function () {
        let _this = this;
        let isPlaying = false;
        let initialUri = "https://www.youtube.com/results?search_query=";
        let searchIndex = 0;
        let musicList;
        let autolistArray = [];
        let autolistNum = 0;
        let autoList;
        //let autoListIndex = 0;


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
                _this.musicplaysave(searchUri);

                let videoTitle = document.getElementById('videoTitle').innerText;
                console.log("videoTitle: "+videoTitle);
                const tableBody = document.querySelector("#tbody");
                console.log("tableBody: " + tableBody);
                let tr = document.createElement("tr");
                tr.setAttribute("id", "trr");
                let td = document.createElement("td");
                td.setAttribute("id", "trc"+autolistNum);
                autolistArray[autolistNum] = searchUri;
                autolistNum++;
                td.innerText = videoTitle;
                tr.appendChild(td);
                tableBody.appendChild(tr);
                tableBody.appendChild(td);

                console.log("autoListArray length: " + autolistArray.length);

                for(let i = 0; i<autolistArray.length; i++){
                    document.getElementById("trc"+i).addEventListener('click',Test);
                    function Test(){
                        autoList = _this.searchMusic(autolistArray[i]);
                        searchIndex = 0;
                        //autoListIndex = 0;
                        _this.overlayInfo(autoList, searchIndex);
                        }
                    }
                // document.querySelector(".tr").appendChild(td);
                // document.getElementById("title").innerText = videoTitle;

            }
            else {
                $('#player')[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                isPlaying = false;
            }
        })


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
                isPlaying = false;
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
            //++autoListIndex;
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
            //--autoListIndex;
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
    musicplaysave : function (){
        var data = {
            thumbnailLink:document.getElementById('thumbnail').getAttribute('src'),
            videoTitle:document.getElementById('videoTitle').innerText,
            videoLink:document.getElementById('player').getAttribute('src')
        };
        var obj;
        $.ajax({
            type: 'POST',
            url: '/musicPlaysave',
            // dataType: 'string',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            async: false
        }).done(function(data) {
            console.log("searchValue: "+data);
            obj = JSON.parse(data);
            // console.log(obj[0].videoTitle);
            // console.log(obj[0].videoLink);
            // console.log(obj[0].thumbnailLink);
        }).fail(function(error) {
            console.log(error);
        });
        return obj;
    },
    testFunc : function (){
        console.log("test");
    },

    overlayInfo : function (musicJson, index) {
        document.getElementById("thumbnail").setAttribute("src", musicJson[index].thumbnailLink);
        document.getElementById("videoTitle").innerText = musicJson[index].videoTitle;
        let link = "https://www.youtube.com/embed/" + musicJson[index].videoLink + "?autoplay=0&amp;rel=0&amp;showinfo=0&amp;showsearch=0&amp;controls=0&amp;enablejsapi=1&amp;playlist=" + musicJson[index].videoLink;
        document.getElementById("player").setAttribute("src", link);
    }
};

main.init();