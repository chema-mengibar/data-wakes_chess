import os
import sys
import urllib
import urllib2
import json

sys.path.append("..")
from lib.router import getPath


dirUniverse = getPath('universe')
dirTaks = os.path.basename(__file__)


def getPlayerGames(nickname, year, month):

  pgnWebUrl  = 'https://api.chess.com/pub/player/{nickname}/games/{year}/{month}'.format(nickname=nickname, year=year, month=month)
  response = urllib2.urlopen(pgnWebUrl)
  data = json.load(response) 

  for game in data['games']:
    pgn= game['pgn']
    time_class= game['time_class']
    time_control= game['time_control']

    white= game['white']
    black= game['black']

    id = game['end_time']

    win_color = ''
    win_user = ''
    if white['result'] == 'win':
      win_color = 'white'
      win_user = white['username']

    if black['result'] == 'win':
      win_color = 'black'
      win_user = black['username']
    
    

    outputPath = '{nickname}/games/{nickname}_{year}-{month}_{id}.pgn'.format(nickname=nickname, year=year, month=month, id=id) 
    fullPathFileName = os.path.join(dirUniverse, dirTaks, outputPath) 

    file_ = open(fullPathFileName, 'w+')
    file_.write(pgn)
    file_.close()

    gameData = {
      'white': white,
      'black': black,
      'id': id,
      'year': year,
      'month': month,
      'win_color': win_color,
      'win_user': win_user,
      'time_class': time_class,
      'time_control': time_control,
    }

    outputPathJson = '{nickname}/{nickname}_report.json'.format(nickname=nickname) 
    jsonPathFileName = os.path.join(dirUniverse, dirTaks, outputPathJson) 

    with open(jsonPathFileName, "r+") as jsonfile:
      jsonData = json.load(jsonfile)
      jsonData.append(gameData)
      jsonfile.seek(0)
      json.dump(jsonData, jsonfile)


# --------------------------------------------------------

PLAYER = 'elsueco1'

years = ['2021']
months = ['01','02','03','04','05','06','07']


directory = "{nickname}/games".format(nickname=PLAYER) 
absDirectory = os.path.join(dirUniverse, dirTaks, directory) 

if not os.path.exists(absDirectory):
  os.makedirs(absDirectory)


jsonReport = "{nickname}/{nickname}_report.json".format(nickname=PLAYER) 
absJsonReport = os.path.join(dirUniverse, dirTaks, jsonReport) 
if not os.path.exists(absJsonReport):
  lst = []
  with open(absJsonReport, mode='w') as f:
    json.dump(lst, f)


for y in years:
  for m in months:
    getPlayerGames(PLAYER, y, m)