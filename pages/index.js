import { useState, useEffect } from 'react';
import Head from 'next/head'
import axios from 'axios';

const spaceId = 'p8a6hwszs1sb';
const accessToken = 'edm-q8Y1dbMHUZZRa6MIhJI0GEr4X_4DmkMbLMUhbc0';
const environment = 'master';
const contentType = 'sticker';

const prepareToSearch = (v) => v.trim().toLowerCase();

export default function Home() {
  const [stickers, setStickers] = useState([]);
  const [tagsSearch, setTagsSearch] = useState('');
  const [colorsSearch, setColorsSearch] = useState('');

  const getStickers = async () => {
    try {
      const tags = prepareToSearch(tagsSearch);
      const colors = prepareToSearch(colorsSearch);

      const response = await axios.get(
        `https://cdn.contentful.com/` +
        `spaces/${spaceId}/` +
        `environments/${environment}/` +
        `entries` +
        `?access_token=${accessToken}` +
        `&content_type=${contentType}` +
        (tags !== '' ? `&fields.tags[all]=${tags}` : '') +
        (colors !== '' ? `&fields.color[all]=${colors}` : '')
      );
      const { items, includes } = response.data;
      const images = includes.Asset.reduce((acc, cur) => {
        acc[cur.sys.id] = cur.fields.file;
        return acc;
      }, {});
      setStickers(items.map((i) => {
        const {name, tags, color, image} = i.fields;
        return {
          name,
          tags,
          color,
          image: images[image.sys.id],
        };
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const findStickers = () => {
    getStickers();
  };

  return (
    <div className="container">
      <Head>
        <title>Frutty</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
      </Head>

      <main>
        <div className="search">
          <div className="control">
            <label className="label" htmlFor="tags">Ключевые слова</label>
            <input
              className="input"
              type="text"
              id="tags"
              value={tagsSearch}
              onChange={(e) => setTagsSearch(e.target.value)}
            />
          </div>
          <div className="control">
            <label className="label" htmlFor="colors">Цвета</label>
            <input
              className="input"
              type="text"
              id="colors"
              value={colorsSearch}
              onChange={(e) => setColorsSearch(e.target.value)}
            />
          </div>
          <button onClick={findStickers} className="button">Найти</button>
        </div>

        <div className="collection">
          {stickers.map((el) =>
            <div key={el.name}>
              <img src={`https://${el.image.url}`} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
};
