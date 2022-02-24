import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head'

const spaceId = 'p8a6hwszs1sb';
const accessToken = 'edm-q8Y1dbMHUZZRa6MIhJI0GEr4X_4DmkMbLMUhbc0';
// const apiToken = 'CFPAT-ikIqgiWBNxEIrzCtos4qAiQqvWTCeGfUvpnOAfcex9s';
const environment = 'master';
const contentType = 'sticker';

const prepareToSearch = (v) => v.trim().toLowerCase();

export default function Home() {
  const [stickers, setStickers] = useState([]);
  const [tagsSearch, setTagsSearch] = useState('');
  const [colorsSearch, setColorsSearch] = useState('');
  const [shapeSearch, setShapeSearch] = useState('');

  const getStickers = async () => {
    try {
      const tags = prepareToSearch(tagsSearch);
      const colors = prepareToSearch(colorsSearch);
      const shape = prepareToSearch(shapeSearch);

      const response = await axios.get(
        `https://cdn.contentful.com/` +
        `spaces/${spaceId}/` +
        `environments/${environment}/` +
        `entries` +
        `?access_token=${accessToken}` +
        `&content_type=${contentType}` +
        `&limit=500` +
        (tags !== '' ? `&fields.tags[all]=${tags}` : '') +
        (colors !== '' ? `&fields.color[all]=${colors}` : '') +
        (shape !== '' ? `&fields.shape=${shape}` : '')
      );
      const { items, includes } = response.data;
      const images = includes.Asset.reduce((acc, cur) => {
        acc[cur.sys.id] = cur.fields.file;
        return acc;
      }, {});
      setStickers(items.map((i) => {
        const {name, tags, color, shape, image} = i.fields;
        return {
          name,
          tags,
          color,
          shape,
          image: images[image.sys.id],
        };
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const findStickers = async () => {
    await getStickers();
    const arr = [];
    const withoutInfo = [];
    for (let i = 1; i <= 223; i++) {
      const stick = stickers.find((item) => item.name === String(i));
      if (stick === undefined) {
        arr.push(i);
      } else {
        if (stick.color === undefined || stick.color === '' || stick.color.length === 0) {
          withoutInfo.push(i);
        }
      }
    }
    console.log('arr', arr);
    console.log('without', withoutInfo);
  };

  const createNew = async () => {
    // const response = await axios.get(
    //   `https://cdn.contentful.com/` +
    //   `spaces/${spaceId}/` +
    //   `environments/${environment}/` +
    //   `assets` +
    //   `?access_token=${accessToken}&limit=300`
    // );
    // const imagesItems = response.data.items;
    // const imagesMap = imagesItems.reduce((acc, cur) => {
    //   acc[cur.fields.title] = cur.sys.id;
    //   return acc;
    // }, {});
    //
    // for (let i = 36; i <= 183; i++) {
    //   await axios.post(
    //     `https://api.contentful.com/` +
    //     `spaces/${spaceId}/` +
    //     `environments/${environment}/` +
    //     `entries`,
    //     {
    //       'fields': {
    //         'name': {
    //           'en-US': String(i)
    //         },
    //         'image': {
    //           'en-US': {
    //             sys: {type: 'Link', linkType: 'Asset', id: imagesMap[String(i)]}
    //           }
    //         }
    //       },
    //     }, {
    //       headers: {
    //         'Authorization': `Bearer ${apiToken}`,
    //         'Content-Type': 'application/vnd.contentful.management.v1+json',
    //         'X-Contentful-Content-Type': contentType,
    //       }
    //     });
    // }
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
          <div className="control">
            <label className="label" htmlFor="shape">Форма</label>
            <input
              className="input"
              type="text"
              id="shape"
              value={shapeSearch}
              onChange={(e) => setShapeSearch(e.target.value)}
            />
          </div>
          <button onClick={findStickers} className="button">Найти</button>
        </div>

        <div className="collection">
          {stickers.map((el) =>
            <div key={el.name}>
              <img
                src={`https://${el.image.url}`}
                alt={`№${el.name}, ${el.shape}, ${el.color?.join(', ')}, ${el.tags?.join(', ')}`}
                title={`№${el.name}, ${el.shape}, ${el.color?.join(', ')}, ${el.tags?.join(', ')}`}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
};
