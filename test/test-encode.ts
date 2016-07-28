import {expect} from 'chai';
import * as _ from 'lodash';
import * as encode from '../src/encode';

describe('encode', () => {

  it('create charset by parameter', () => {
    const chars = encode.createCharset('Aa0');
    expect(chars.length).to.equal(62);
    expect(_.uniq(chars).length).to.equal(62);
    expect(chars[0]).to.equal('A');
    expect(chars[26]).to.equal('a');
    expect(chars[52]).to.equal('0');
  });

  it('exclude characters from charset', () => {
    const chars = encode.createCharset('0A-IO');
    expect(chars.length).to.equal(34);
    expect(_.uniq(chars).length).to.equal(34);
    expect(chars[0]).to.equal('0');
    expect(chars[10]).to.equal('A');
    expect(chars.indexOf('I')).to.equal(-1);
    expect(chars.indexOf('O')).to.equal(-1);
  });

  it('exclude characters not in charset', () => {
    const chars = encode.createCharset('0A-a');
    expect(chars.length).to.equal(36);
    expect(_.uniq(chars).length).to.equal(36);
    expect(chars[0]).to.equal('0');
    expect(chars[10]).to.equal('A');
  });

  it('throw error on invalid charset parameter', () => {
    expect(() => encode.createCharset('x')).to.throw(Error);
  });

  it('encode a byte array', () => {
    const bytes = [0x00, 0x01, 0x00, 0x01, 0x00, 0xff];
    const codec = encode.codec('0Aa');
    const buf = Buffer.from(bytes);
    const code = codec.encode(buf);
    expect(code).to.equal('04gfWJD');
    expect(codec.decode(code)).to.eql(bytes);
  });

  it('calculate bytes required', () => {
    expect(encode.codec('0').bytesForLength(1)).to.equals(1);
    expect(encode.codec('0').bytesForLength(5)).to.equals(3);
    expect(encode.codec('Aa-ABCDEFGHIJKL').bytesForLength(3)).to.equals(2);
    expect(encode.codec('Aa-ABCDEFGHIJK').bytesForLength(3)).to.equals(3);
  });
});