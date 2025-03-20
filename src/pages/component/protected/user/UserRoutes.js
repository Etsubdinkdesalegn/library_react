import { Route, Routes } from 'react-router-dom';
import BorrowerList from '../../borrow/BorrowerList';
import BookList from '../../book/BookList';
import UpdateBorrower from '../../borrow/UpdateBorrower';
import BorrowForm from '../../borrow/BorrowForm';
import BookForm from '../../book/BookForm';
import UserHeader from '../../header/UserHeader';

const UserRoutes = () => {
  return (
    <>
     <UserHeader />
      <Routes>
        <Route path='/book' element={<BookForm/>}/>
        <Route path='/borrower' element={<BorrowForm/>}/>
        <Route path='/book_list' element={<BookList/>}/>
        <Route path='/borrower_list' element={<BorrowerList/>}/>
        <Route path='/update_borrower/:borrower_id' element={<UpdateBorrower/>}/>
      <Route path='*' element={<div>User Page Not Found</div>} />
    </Routes>
    </>
  );
};

export default UserRoutes;
