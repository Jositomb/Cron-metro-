"""Download Spanish meeting workbooks from jw.org into the Pages artifact.
No credentials or third-party services. Fail closed if content structure changes.
"""
import datetime as dt
import html
import json
import re
import shutil
import time
import urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse
MONTHS=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
BASE='https://www.jw.org'
ROOT=Path(__file__).resolve().parent
def text(raw):
    return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',raw))).strip()
def download(url):
    if urlparse(url).hostname!='www.jw.org':raise ValueError('Unexpected source host')
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'MeetingGuide/1.0 (personal meeting preparation)'}),timeout=35) as response:
                if urlparse(response.url).hostname!='www.jw.org':raise ValueError('Unexpected redirect')
                return response.read(2500000).decode('utf-8')
        except Exception:
            if attempt==2:raise
            time.sleep(2)
def parse(raw,url,year):
    article=re.search(r'<article\b[^>]*\bid=["\']article["\'][^>]*>(.*?)</article>',raw,re.S|re.I)
    if not article:raise ValueError('No article found')
    blocks=list(re.finditer(r'<(h1|h2|h3|p)\b[^>]*>(.*?)</\1>',article[1],re.S|re.I))
    label=next((text(b[2]) for b in blocks if b[1]=='h1'),'')
    date=re.search(r'(\d{1,2})(?:[-–]\d{1,2})? de ('+'|'.join(MONTHS)+')',label,re.I)
    if not date:raise ValueError('No week date')
    monday=dt.date(year,MONTHS.index(date[2].lower())+1,int(date[1]))
    if monday.weekday()!=0:raise ValueError('Week does not begin Monday')
    parts=[];group='';current=None;songs={};intro=None;closing=None
    def minutes(s):
        m=re.search(r'\((\d+)\s*min',s,re.I)
        return int(m[1]) if m else None
    for b in blocks:
        tag,body=b[1].lower(),b[2];s=text(body)
        if tag=='h2':
            if s in ['TESOROS DE LA BIBLIA','SEAMOS MEJORES MAESTROS','NUESTRA VIDA CRISTIANA']:group=s;current=None
        elif tag=='h3':
            song=re.search(r'Canción\s+(\d+)',s,re.I)
            if 'Palabras de introducción' in s:
                intro=minutes(s)
                if song:songs['openingSong']=song[1]
            elif 'Palabras de conclusión' in s:
                closing=minutes(s);current=None
                if song:songs['closingSong']=song[1]
            elif re.match(r'^\d+\.\s',s):
                n,title=re.split(r'\.\s+',s,maxsplit=1)
                current={'number':int(n),'title':title,'min':minutes(s),'section':group,'body':[],'lesson':'','lessonUrl':''};parts.append(current)
            elif song and group=='NUESTRA VIDA CRISTIANA':songs['middleSong']=song[1];current=None
        elif tag=='p' and current and s and s not in ['Respuesta','Su respuesta']:
            if current['min'] is None:current['min']=minutes(s)
            current['body'].append(re.sub(r'^\(\d+\s*mins?\.\)\s*','',s))
            lesson=re.search(r'\b(?:th|lmd)\s+(?:lección\s+)?\d+(?:\s+punto\s+\d+)?',s,re.I)
            if lesson:current['lesson']=lesson[0]
            for href,anchor in re.findall(r'<a\b[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',body,re.S|re.I):
                if re.search(r'\b(?:th|lmd)\s+(?:lección\s+)?\d+',text(anchor),re.I):current['lessonUrl']=urljoin(url,html.unescape(href))
    if intro is None or closing is None or len(parts)<6 or not all(k in songs for k in ['openingSong','middleSong','closingSong']):raise ValueError('Incomplete meeting')
    if [p['number'] for p in parts]!=list(range(1,len(parts)+1)):raise ValueError('Invalid numbering')
    if any(p['min'] is None or not 0<p['min']<=180 or not p['section'] for p in parts):raise ValueError('Invalid durations or sections')
    out=[{'title':'Palabras de introducción','min':intro,'section':'','kind':'opening','guideText':'','guideUrl':url}];previous='';treasure=0
    for p in parts:
        section=p['section'];kind='living'
        if section=='TESOROS DE LA BIBLIA':kind=['treasure','pearls','reading'][min(treasure,2)];treasure+=1
        elif section=='SEAMOS MEJORES MAESTROS':kind='studentTalk' if p['title'].lower().startswith('discurso') else 'student'
        elif 'estudio' in p['title'].lower() and 'congregación' in p['title'].lower():kind='study'
        content='\n\n'.join(p['body'])
        if len(content)>16000:raise ValueError('Guide part too long')
        out.append({'title':p['title'],'min':p['min'],'section':section if section!=previous else '', 'kind':kind,'guideText':content,'guideUrl':url,'lesson':p['lesson'],'lessonUrl':p['lessonUrl']});previous=section
    out.append({'title':'Palabras de conclusión','min':closing,'section':'','kind':'conclusion','role':'conclusion','guideText':'','guideUrl':url})
    return {'schema':1,'week':monday.isoformat(),'label':label,'source':url,'parts':out,'meeting':{**songs,'middleSongPosition':'living'}}
def main():
    today=dt.date.today();anchor=today-dt.timedelta(days=today.weekday());start=anchor.month if anchor.month%2 else anchor.month-1;weeks={}
    for offset in [0,2]:
        m=start+offset;year=anchor.year+(m-1)//12;m=(m-1)%12+1
        index=f'{BASE}/es/biblioteca/guia-actividades-reunion-testigos-jehova/{MONTHS[m-1]}-{MONTHS[m]}-{year}-mwb/'
        try:page=download(index)
        except Exception:
            if offset==0:raise
            continue
        links={urljoin(index,html.unescape(h)) for h in re.findall(r'href=["\']([^"\']+)["\']',page) if 'Vida-y-Ministerio-Cristianos-' in h and 'guia-actividades' in urljoin(index,h)}
        for url in sorted(links):
            week=parse(download(url),url,year);weeks[week['week']]=week;time.sleep(.25)
    if not weeks or not any(w<=today.isoformat()<= (dt.date.fromisoformat(w)+dt.timedelta(days=6)).isoformat() for w in weeks):raise ValueError('Current week missing; publication cancelled')
    public=ROOT/'_site';public.mkdir(exist_ok=True)
    for p in ROOT.iterdir():
        if p.is_file() and p.suffix in ['.html','.js','.css','.json','.svg','.webmanifest']:shutil.copy2(p,public/p.name)
    dest=public
    for key,week in weeks.items():(dest/('guide-'+key+'.json')).write_text(json.dumps(week,ensure_ascii=False),encoding='utf-8')
    (dest/'guide-index.json').write_text(json.dumps({'schema':1,'updated':dt.datetime.now(dt.timezone.utc).isoformat(),'weeks':[{'week':w,'label':v['label']} for w,v in sorted(weeks.items())]},ensure_ascii=False),encoding='utf-8')
    print(f'Validated {len(weeks)} weeks from jw.org; Pages artifact ready.')
if __name__=='__main__':main()
