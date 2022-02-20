import { useState, useEffect } from 'react';
import Head from 'next/head'
import axios from 'axios';

const spaceId = 'p8a6hwszs1sb';
const accessToken = 'edm-q8Y1dbMHUZZRa6MIhJI0GEr4X_4DmkMbLMUhbc0';
const environment = 'master';
const contentType = 'sticker';

export default function Home() {
  const [stickers, setStickers] = useState([]);
  const [tagsSearch, setTagsSearch] = useState('');
  const [colorsSearch, setColorsSearch] = useState('');

  const getStickers = async () => {
    try {
      const response = await axios.get(
        `https://cdn.contentful.com/` +
        `spaces/${spaceId}/` +
        `environments/${environment}/` +
        `entries` +
        `?access_token=${accessToken}` +
        `&content_type=${contentType}` +
        (tagsSearch.trim() !== '' ? `&fields.tags[in]=${tagsSearch}` : '') +
        (colorsSearch.trim() !== '' ? `&fields.color[in]=${colorsSearch}` : '')
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

  useEffect(() => {
    getStickers();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <input type="text" value={tagsSearch} onChange={(e) => setTagsSearch(e.target.value)} />
        </div>
        <div>
          <input type="text" value={colorsSearch} onChange={(e) => setColorsSearch(e.target.value)} />
        </div>
        <button onClick={findStickers}>Найти</button>

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
