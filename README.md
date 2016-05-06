# The Information Code Challenge

This project uses `pandas`, a popular Python library, for data analysis, and [Jupyter notebooks](http://jupyter.org/), an evolution of `iPython notebook`, to record my workflow. Jupyter turns your browser into a lab notebook which can execute code. This project also uses HTML, JavaScript, and D3.js for the visualization.

## Installing `pandas`

If you don't already use Python, you can use [Anaconda](https://www.continuum.io/why-anaconda), which automatically installs Jupyter.

If you're an experienced Python programmer, make a `virtualenv` environment into which you can install pandas and Jupyter:

`pip install pandas`

`pip install jupyter`

or use the [requirements.txt](requirements.txt) file:

`pip install -r requirements.txt`

To see the notebook, run the following command:

```bash
jupyter notebook "IPOs.ipynb"
```

## Viewing the visualization

To see the visualization, change directories into /viz and start a simple HTTP server from the command line:

`python -m SimpleHTTPServer`

Navigate to `localhost:8000`