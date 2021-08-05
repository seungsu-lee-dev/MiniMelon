var main = {
    init : function () {
        let _this = this;
        let isPlaying = false;
        let initialUri = "https://www.youtube.com/results?search_query=";
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
            if (!isPlaying) {
                $('#player')[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                isPlaying = true;
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
                _this.searchMusic(searchUri);
            }
        });
        $('#btn-nextMusic').on('click', function () {
            _this.nextMusic();
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
            console.log(obj.thumbnailLink);
            console.log(obj.videoLink);
            console.log(obj.videoTitle);
        }).fail(function(error) {
            console.log(error);
        });
        this.overlayInfo(obj.thumbnailLink, obj.videoLink, obj.videoTitle);
    },
    overlayInfo : function (thumbnailLink, videoLink, videoTitle) {
        document.getElementById("thumbnail").setAttribute("src", thumbnailLink);
        document.getElementById("videoTitle").innerText = videoTitle;
        let link = "https://www.youtube.com/embed/" + videoLink + "?autoplay=0&amp;rel=0&amp;showinfo=0&amp;showsearch=0&amp;controls=0&amp;enablejsapi=1&amp;playlist=" + videoLink;
        document.getElementById("player").setAttribute("src", link);
    },
    nextMusic : function () {

    }

};

main.init();