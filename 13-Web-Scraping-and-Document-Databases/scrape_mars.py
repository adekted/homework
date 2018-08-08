# import dependencies
from selenium import webdriver
from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import time
import datetime

def scrape():
    # Initialize Chrome Browser
    chrome_driver = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **chrome_driver, headless=True)

    # 1 - Extract Nasa Title & Teaser
    nasa = 'https://mars.nasa.gov/news'
    browser.visit(nasa)
    nasa_link = browser.html
    nasa_scraper = bs(nasa_link, 'html.parser')

    nasa_title = nasa_scraper.find("div", class_="content_title").get_text()
    nasa_teaser = nasa_scraper.find("div", class_="article_teaser_body").get_text()

    # 2 - Extract Featured Image URL
    mars_image_url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(mars_image_url)
    browser.click_link_by_partial_text('FULL IMAGE')
    time.sleep(1)
    browser.click_link_by_partial_text('more info')
    image_html = browser.html

    image_scraper = bs(image_html, "html.parser")
    image_path = image_scraper.find('figure', class_='lede')
    image_url = "https://www.jpl.nasa.gov/" + image_path.a['href']

    # 3 - Extract Most Recent Mars Twitter
    mars_twitter = "https://twitter.com/marswxreport?lang=en"
    browser.visit(mars_twitter)

    mars_weather = browser.html
    weather_scraper = bs(mars_weather, 'html.parser')
    mars_twitter = weather_scraper.find_all('p', class_="TweetTextSize TweetTextSize--normal js-tweet-text tweet-text")

    current_weather = ""
    for tweet in mars_twitter:
        if tweet.text.startswith("Sol"):
            current_weather = tweet.text
            break
    
    # 4 - Extract Mars Facts to HTML
    mars_facts = pd.read_html("https://space-facts.com/mars/")[0]
    mars_facts.columns=['Property','Value']
    mars_facts.set_index('Property', inplace=True)
    mars_html = mars_facts.to_html()

    # 5 - Extract Hemispheres and URL
    hemispheres_url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(hemispheres_url)

    mars_hemispheres = browser.html
    hemispheres_scraper = bs(mars_hemispheres, 'html.parser')
    hemispheres = hemispheres_scraper.find_all("h3")

    hemisphere_dicts = []
    for hem in hemispheres:
        hemisphere_text = hem.get_text()
        time.sleep(1)
        browser.click_link_by_partial_text(hemisphere_text)
        time.sleep(1)
        
        new_page = browser.html
        hem_page = bs(new_page, 'html.parser')
        img_link = hem_page.find('div', class_='downloads').find('li').a['href']
        
        hem_dict = {}
        hem_dict['title'] = hemisphere_text
        hem_dict['img_url'] = img_link
        hemisphere_dicts.append(hem_dict)
        browser.back()

    # Add all to a dictionary and return
    mars_data = {
        "time": datetime.datetime.now(),
        "news_title": nasa_title,
        "news_teaser": nasa_teaser,
        "featured_image": image_url,
        "weather": current_weather,
        "facts": mars_html,
        "hemispheres": hemisphere_dicts
    }
    
    print (mars_data)
    return mars_data