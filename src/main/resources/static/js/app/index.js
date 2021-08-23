var main = {
    init : function () {
        let _this = this;
        let isPlaying = false;
        let initialUri = "https://www.youtube.com/results?search_query=";
        let searchIndex = 0;
        let musicList;
        let playListName = "";
        let playList = "";
        let playUri = "";
        let timerId = 0;
        let timerId2 = 0;
        let listIndexArray = [];
        let overallMusicJson = "";
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
            } else if (!isPlaying) {
                $('#player')[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                isPlaying = true;

                let singer = document.getElementById('singer').value;
                let songTitle = document.getElementById('songTitle').value;
                let searchUri = "";

                searchUri = initialUri + singer + "+" + songTitle;
                _this.autoplaysave(searchUri);

                // const videoTitle = document.getElementById('videoTitle').innerText;
                // console.log("videoTitle: "+videoTitle);
                // const tableBody = document.querySelector("#tbody");
                // console.log("tableBody: " + tableBody);
                // let tr = document.createElement("tr");
                // let td = document.createElement("td");
                // td.innerText = videoTitle;
                //
                // tr.appendChild(td);
                // tableBody.appendChild(tr);
                startTimer();
            } else {
                $('#player')[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                isPlaying = false;
                if (timerId!=0) {
                    clearInterval(timerId);
                }
            }
        });

        $('#btn-search').on('click', function () {
            playList = ""; // 검색하면 플레이리스트 리스트 초기화
            if (timerId!=0) {
                clearInterval(timerId);
            }
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
                console.log("musicList: " + musicList.toString());
                // JSON.parse(data);
                overallMusicJson = musicList;
                searchIndex = 0;
                isPlaying = false;
                playUri = _this.overlayInfo(musicList, searchIndex, false);
                _this.resetTime();
            }
        });
        $('#btn-nextMusic').on('click', function () {
            if (timerId!=0) {
                clearInterval(timerId);
            }
            if (musicList==null) {
                alert("노래를 검색해주세요");
                return;
            } else if (searchIndex==(musicList.length-1)) {
                alert("마지막 영상입니다");
                return;
            }
            isPlaying = false;
            if (playList == musicList) {
                playUri = _this.overlayInfo(musicList, ++searchIndex, true);
            }
            else {
                playUri = _this.overlayInfo(musicList, ++searchIndex, false);
            }
            _this.resetTime();
        });
        $('#btn-previousMusic').on('click', function () {
            if (timerId!=0) {
                clearInterval(timerId);
            }
            if (musicList==null) {
                alert("노래를 검색해주세요");
                return;
            } else if (!searchIndex) {
                alert("처음 영상입니다");
                return;
            }
            isPlaying = false;
            if (playList == musicList) {
                playUri = _this.overlayInfo(musicList, --searchIndex, true);
            }
            else {
                playUri = _this.overlayInfo(musicList, --searchIndex, false);
            }
            _this.resetTime();
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
                let a = document.createElement("a");
                a.setAttribute("href", "javascript:void(0);");
                a.addEventListener("click", songClick);
                a.setAttribute("class", "songA");
                let listIndex = listIndexArray.length;
                listIndexArray[listIndex] = document.getElementById('videoTitle').innerText;
                a.innerText = document.getElementById('videoTitle').innerText;
                td.appendChild(a);
                tr.appendChild(td);
                selectBody.appendChild(tr);
            }
        });

        $("#controlBar").on('input change', function () {
            if (timerId!=0) {
                clearInterval(timerId);
            }
            startTimer();
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

        function startTimer() {
            if (timerId2!=0) {
                clearTimeout(timerId2);
            }
            let secondResult = document.getElementById('controlBar').getAttribute('max');
            let presentSecond = document.getElementById('controlBar').value;
            console.log("timerId: " + timerId);
            timerId = setInterval(function () {
                presentSecond++;
                _this.moveControlBar(presentSecond+0);
            }, 1000);
            console.log("timerId: " + timerId);
            console.log("presentSecond: "+ presentSecond);
            console.log("secondResult: " + secondResult);
            timerId2 = setTimeout(function () {
                clearInterval(timerId);
                isPlaying=false;
                _this.resetTime();
                timerId = 0;
                console.log(timerId + " Timer Reset");
            }, (secondResult-presentSecond+0)*1000);
        };

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

            console.log(playList);
            console.log(playList.videoTitle);
            let playListLength = Object.keys(playList).length;
            console.log("playListLength: " + playListLength);

            for (let i=0;i<playListLength;i++) {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                let a = document.createElement("a");
                a.setAttribute("href", "javascript:void(0);");
                a.addEventListener("click", songClick);
                a.setAttribute("class", "songA");
                listIndexArray[i] = playList[i].videoTitle;
                a.innerText = playList[i].videoTitle;
                td.appendChild(a);
                tr.appendChild(td);
                selectBody.appendChild(tr);
            }
        });

        function songClick() {
            if (timerId!=0) {
                clearInterval(timerId);
            }
            musicList = playList;
            let songName = $(this).text();
            let musicObject = "";
            console.log(songName);
            console.log(playList);
            $.each(playList, function (index) {
               if (this["videoTitle"] == songName) {
                   musicObject = this;
                   console.log("videoTitle equal");
                   console.log("playlist index: " + index);
                   searchIndex = index;
               }
            });
            console.log(musicObject);
            // playUri = _this.overlayInfo(musicObject, 0);

            playUri = _this.overlayInfo(musicList, searchIndex, true);
            _this.resetTime();
        };

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
            if (data.indexOf("html")!=-1) {
                console.log("contains html");
                window.location.href = '/login';
            }
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
            videoLink:document.getElementById('player').getAttribute('src'),
            second:document.getElementById('controlBar').getAttribute('max')
        };
        var obj;
        $.ajax({
            type: 'POST',
            url: '/myPlaysave',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            async: false
        }).done(function(data) {
            if (data.indexOf("html")!=-1) {
                console.log("contains html");
                window.location.href = '/login';
            }
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
            if (data.indexOf("html")!=-1) {
                console.log("contains html");
                window.location.href = '/login';
            }
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
            if (data.indexOf("html")!=-1) {
                console.log("contains html");
                window.location.href = '/login';
            }
            obj = JSON.parse(data);
        }).fail(function(error) {
            console.log(error);
        });
        return obj;
    },

    overlayInfo : function (musicJson, index, playlistBool) {
            if (playlistBool) {
            // if (index == -1) {
                document.getElementById("thumbnail").setAttribute("src", musicJson[index].thumbnailLink);
                document.getElementById("videoTitle").innerText = musicJson[index].videoTitle;
                let link = musicJson[index].videoLink;
                document.getElementById("player").setAttribute("src", link);
                document.getElementById("controlBar").setAttribute("style", "");
                document.getElementById("controlBar").setAttribute("max", musicJson[index].second);
                document.getElementById("range_val").setAttribute("style", "");
                return musicJson.videoLink;
            } else {
            document.getElementById("thumbnail").setAttribute("src", musicJson[index].thumbnailLink);
            document.getElementById("videoTitle").innerText = musicJson[index].videoTitle;
            let link = musicJson[index].videoLink;
            if (!playlistBool) {
                link = "https://www.youtube.com/embed/" + musicJson[index].videoLink + "?autoplay=0&amp;rel=0&amp;showinfo=0&amp;showsearch=0&amp;controls=0&amp;enablejsapi=1&amp;playlist=" + musicJson[index].videoLink;
            }
            // let link = "https://www.youtube.com/embed/" + musicJson[index].videoLink + "?autoplay=0&amp;rel=0&amp;showinfo=0&amp;showsearch=0&amp;controls=0&amp;enablejsapi=1&amp;playlist=" + musicJson[index].videoLink;
            document.getElementById("player").setAttribute("src", link);
            document.getElementById("controlBar").setAttribute("style", "");
            document.getElementById("controlBar").setAttribute("max", musicJson[index].second);
            document.getElementById("range_val").setAttribute("style", "");
            return musicJson[index].videoLink;
            }
        },

    hideTable : function () {
        document.getElementById("hideTr").setAttribute("style", "display:none");
    },

    controlTime:function (playUri, second) {
        document.getElementById("player").setAttribute("src", "https://www.youtube.com/embed/" + playUri + "?start="+second+"&autoplay=1&amp;rel=0&amp;showinfo=0&amp;showsearch=0&amp;controls=0&amp;enablejsapi=1&amp;playlist=" + playUri);
    },

    resetTime:function() {
        document.getElementById("resetForm").reset();
        document.getElementById('controlBar').setAttribute("value","0");
        let timeValue = "0분 0초";
        document.getElementById("range_val").setAttribute("value", timeValue);
    },

    moveControlBar:function(secondSum) {
        console.log("second: " + secondSum);
        document.getElementById('range_val').innerHTML = secondSum;
        document.getElementById('controlBar').setAttribute("value", secondSum);

        let hour = parseInt(secondSum/3600);
        let timeValue = "";

        if (hour>0) {
            let minute = parseInt(secondSum%60/60);
            let second = secondSum%60;
            timeValue = hour + "시간 " + minute + "분 " + second + "초";
        } else {
            let minute = parseInt(secondSum/60);
            let second = secondSum%60;
            timeValue = minute + "분 " + second + "초";
        }
        document.getElementById("resetForm").reset();
        document.getElementById("range_val").setAttribute("value", timeValue);
    },

};
main.init();