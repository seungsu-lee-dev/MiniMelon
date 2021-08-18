var main = {
    init : function () {
        let _this = this;
        let isPlaying = false;
        let initialUri = "https://www.youtube.com/results?search_query=";
        let searchIndex = 0;
        let musicList;
        let playUri = "";
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
            if (musicList == null) {
                alert("노래를 검색해주세요");
            } else if (!isPlaying) {
                $('#player')[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                isPlaying = true;

                let singer = document.getElementById('singer').value;
                let songTitle = document.getElementById('songTitle').value;
                let searchUri = "";

                searchUri = initialUri + singer + "+" + songTitle;
                autoList = _this.autoplaysave(searchUri);
                playUri = _this.overlayInfo(autoList, searchIndex);
            } else {
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
            } else if (!songTitle) {
                alert("제목을 입력해주세요");
                document.getElementById('songTitle').focus();
            } else {
                searchUri = initialUri + singer + "+" + songTitle;
                musicList = _this.searchMusic(searchUri);
                searchIndex = 0;
                playUri = _this.overlayInfo(musicList, searchIndex);
                _this.resetTime();
            }
        });
        $('#btn-nextMusic').on('click', function () {
            if (musicList == null) {
                alert("노래를 검색해주세요");
                return;
            } else if (searchIndex == (musicList.length - 1)) {
                alert("마지막 영상입니다");
                return;
            }
            isPlaying = false;
            playUri = _this.overlayInfo(musicList, ++searchIndex);
            _this.resetTime();
        });
        $('#btn-previousMusic').on('click', function () {
            if (musicList == null) {
                alert("노래를 검색해주세요");
                return;
            } else if (!searchIndex) {
                alert("처음 영상입니다");
                return;
            }
            isPlaying = false;
            playUri = _this.overlayInfo(musicList, --searchIndex);
            _this.resetTime();
        });

        $('#btn-putMusic').on('click', function () {
            if (musicList == null) {
                alert("노래를 선택해주세요");
            } else {
                _this.myplaysave();
            }
        });

        $("#controlBar").on('input change', function () {
            let hour = parseInt(this.value/3600);
            let timeValue = "";
            if (hour>0) {
                let minute = parseInt(this.value%60/60);
                let second = this.value%60;
                timeValue = hour + "시간 " + minute + "분 " + second + "초";
            }
            else {
                let minute = parseInt(this.value/60);
                let second = this.value%60;
                timeValue = minute + "분 " + second + "초";
            }

            document.getElementById("range_val").setAttribute("value", timeValue);
            _this.controlTime(playUri, this.value);
            $('#player')[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            isPlaying = true;
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
            console.log("autoplayValue: "+data);
            obj = JSON.parse(data);
//            console.log(obj[0].videoTitle);
//            console.log(obj[0].videoLink);
//            console.log(obj[0].thumbnailLink);
        }).fail(function(error) {
            console.log(error);
        });
        return obj;
    },

    myplaysave : function (){
        var data = {
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


    overlayInfo : function (musicJson, index) {
        document.getElementById("thumbnail").setAttribute("src", musicJson[index].thumbnailLink);
        document.getElementById("videoTitle").innerText = musicJson[index].videoTitle;
        let link = "https://www.youtube.com/embed/" + musicJson[index].videoLink + "?autoplay=0&amp;rel=0&amp;showinfo=0&amp;showsearch=0&amp;controls=0&amp;enablejsapi=1&amp;playlist=" + musicJson[index].videoLink;
        document.getElementById("player").setAttribute("src", link);
        document.getElementById("controlBar").setAttribute("style", "");
        document.getElementById("controlBar").setAttribute("max", musicJson[index].second);
        document.getElementById("range_val").setAttribute("style", "");
        return musicJson[index].videoLink;
    },
    controlTime:function (playUri, second) {
        document.getElementById("player").setAttribute("src", "https://www.youtube.com/embed/" + playUri + "?start="+second+"&autoplay=1&amp;rel=0&amp;showinfo=0&amp;showsearch=0&amp;controls=0&amp;enablejsapi=1&amp;playlist=" + playUri);
    },
    resetTime:function() {
        document.getElementById('range_val').innerHTML=0;
        let timeValue = "0분 0초";
        document.getElementById("range_val").setAttribute("value", timeValue);
        document.getElementById("resetForm").reset();
    }

};

main.init();