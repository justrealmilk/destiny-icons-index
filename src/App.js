import React from 'react';

import './App.css';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      data: false
    };
  }

  async componentDidMount() {
    const root = await fetch(`https://api.github.com/repos/justrealmilk/destiny-icons/contents/`, {
      headers: {
        Authorization: 'token dd9c981789b0763fcc960f5b6f93cec10005a14a'
      }
    })
      .then(response => {
        return response.json();
      })
      .catch(e => {
        console.log(e);
      });

    await Promise.all(root.filter(i => i.type === 'dir').map(async d => {
      const files = await fetch(d.url, {
        headers: {
          Authorization: 'token dd9c981789b0763fcc960f5b6f93cec10005a14a'
        }
      })
        .then(response => {
          return response.json();
        })
        .catch(e => {
          console.log(e);
        });

      if (files) {
        await Promise.all(files.map(async f => {
          const file = await fetch(f.download_url)
            .then(response => {
              return response.text();
            })
            .catch(e => {
              console.log(e);
            });

            f.trueContent = file;
        }));

        d.files = files;
      }
    }));

    console.log(root.filter(i => i.type === 'dir'))

    this.setState({
      data: root.filter(i => i.type === 'dir')
    });
  }

  render() {
    if (!this.state.data) {
      return (
        <div className='view' id='loading'>
          <p>one sec</p>
        </div>
      );
    } else {
      return (
        <div className='view' id='index'>
          {this.state.data.map((d, i) => {
            return (
              <div key={i} className='dir'>
                <h2>{d.name}</h2>
                <div className='files'>
                  {d.files.map((f, i) => {

                    return (
                      <div key={i} className='file'>
                        <img src={`data:image/svg+xml;base64,${window.btoa(f.trueContent)}`} alt={f.name} />
                        <div className='name'>{f.name}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      );
    }
  }
}

export default App;