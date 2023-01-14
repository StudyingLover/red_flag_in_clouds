import requests
from bs4 import BeautifulSoup
import os

proxies = {'http': 'http://127.0.0.1:1080', 'https': 'http://127.0.0.1:1080'}

def download_html_and_images(url, save_path):
    response = requests.get(url, proxies=proxies)
    soup = BeautifulSoup(response.text, 'html.parser')
    os.makedirs(save_path, exist_ok=True)

    # save html
    with open(os.path.join(save_path, 'index.html'), 'w',encoding='utf-8') as file:
        file.write(str(soup))

    # download images
    for img in soup.find_all('img'):
        img_url = img.get('src')
        if not img_url.startswith('http'):
            # if the url is not absolute, make it absolute
            img_url = url + img_url
        response = requests.get(img_url, stream=True, proxies=proxies)
        img_name = os.path.join(save_path, os.path.basename(img_url))
        with open(img_name, 'wb') as out_file:
            out_file.write(response.content)
    print(f'Web page and images saved to {save_path}')

url = 'https://www.google.com'
save_path = 'example'

# download html and images
download_html_and_images(url, save_path)