import UploadForm from '../components/UploadForm';
import CreditInfo from '../components/CreditInfo';
import CreditRequestForm from '../components/CreditRequest';

const Home = () => {
  return (
    <div className="container">
      <h2>Welcome to Document Matcher</h2>
      <CreditInfo />
      <UploadForm />
      <CreditRequestForm />
    </div>
  );
};

export default Home;