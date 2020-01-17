import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const MediaCardStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

const GridStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


const sizeList = ['S','M','L','XL'];
const ButtonSize = ({size}) => (
  <Button variant="outlined" color="primary">{size}</Button>
)
const MediaCard = ({title, image, desc, price, size}) => {
  const classes = MediaCardStyles();
  return(
  <Card className={classes.card}>
    <CardActionArea>
    <CardMedia
             component="img"
             alt="T-shirt"
             image= {image}
             title="T-shirt"/>
    <CardContent>
      <Typography gutterBottom variant="h9" component="h2">{title}</Typography>
      <Typography variant="body2" color="textSecondary" component="p">{desc}</Typography>
      <Typography variant="body1" color="textPrimary" component="p">${price}</Typography>
      {sizeList.map(size => <ButtonSize size={size}/>)}
    </CardContent>
    </CardActionArea>
    <CardActions>
        <Button size="small" color="primary">
          Add to cart
        </Button>
      </CardActions>
  </Card>
  )
};

const CardList = ({ products }) => {
  const classes = GridStyles();
  return (
    <div className={classes.root}>
       <Grid container spacing={3}>
        { products.map(product =>
        <Grid item xs={3}>
           <MediaCard  title={ product.title } image = {"./data/products/"+product.sku+"_1.jpg"} desc = {product.description}
           price = {product.price} size = {product.size}/>
           </Grid>) }
        </Grid>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <ul>
      <CardList products = {products}/>
    </ul>
  );
};

export default App;
