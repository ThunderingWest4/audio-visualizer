from PyQt5.QtWidgets import *
from PyQt5 import uic
from youtube_dl import YoutubeDL

# downloader = YoutubeDL({
#                         'format': 'bestaudio', # download mp3
#                         'outtmpl': 'music\\%(title)s-%(id)s.%(ext)s' # download to folder in this dir, 'music', for easy keeping together
#                     })

# song = "https://www.youtube.com/watch?v=CSWsmx_7KcQ"
# downloader.download([song])

"""
TODO: 
✓ connect "Add Song" button to actually add songs to QList
✓ connect "Click to Download" to ytdl and make popup when done download
- progress bar?
- remove songs from list?
"""

songs = {}

class Ui(QDialog):
    def __init__(self):
        super(Ui, self).__init__() # Call the inherited classes __init__ method
        uic.loadUi('YTDownload\qtTemplate.ui', self) # Load the .ui file
        
        self.songlist = self.findChild(QScrollArea, 'songList')
        self.songlist.setWidget(QListWidget())

        self.addBtn = self.findChild(QPushButton, 'songAdd')
        self.addBtn.clicked.connect(self.addSong)
        # for i in range(50):
        #     self.songlist.widget().addItem(f"{i}")
        self.downloadBtn = self.findChild(QPushButton, 'activateDownload')
        self.downloadBtn.clicked.connect(self.download)

        self.show() # Show the GUI
    
    def addSong(self):
        songname = self.findChild(QPlainTextEdit, 'nameEnter').toPlainText()
        songlink = self.findChild(QPlainTextEdit, 'linkEnter').toPlainText()
        songs[songlink] = songname
        self.songlist.widget().addItem(f"{songname} | {songlink}")

    def download(self):
        for link in songs.keys():
            name = songs[link]
            with YoutubeDL({'format': 'bestaudio', 'outtmpl': f'music\\{name}.%(ext)s'}) as downloader:
                     downloader.download([link])

        msg = QMessageBox()
        msg.setWindowTitle("Download")
        msg.setText("Download Complete!")
        _ = msg.exec_()

app = QApplication([])
win = Ui()
win.setWindowTitle("Youtube Easy Download")
app.exec_()